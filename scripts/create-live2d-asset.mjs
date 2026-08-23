import { spawnSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const fps = 30

const args = process.argv.slice(2)
const takeValue = (name, fallback) => {
  const index = args.indexOf(name)
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback
}
const hasFlag = (name) => args.includes(name)

const text = takeValue('--text', '')
const requestedName = takeValue('--name', 'live2d-clip')
const name = requestedName.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/^-+|-+$/g, '') || 'live2d-clip'
const apiBase = takeValue('--api-base', 'http://127.0.0.1:8001').replace(/\/$/, '')
const background = takeValue('--background', 'transparent')
const minimumSeconds = Number(takeValue('--seconds', '0'))
const fromPropsPath = takeValue('--from-props', '')
const useTts = !hasFlag('--no-tts')
const useMotion = !hasFlag('--no-motion')
const sleepMode = hasFlag('--sleep')

if (!['transparent', 'chroma'].includes(background)) {
  throw new Error('--background must be transparent or chroma')
}
if (!Number.isFinite(minimumSeconds) || minimumSeconds < 0) {
  throw new Error('--seconds must be a non-negative number')
}
if ((useTts || useMotion) && !text && !fromPropsPath) {
  throw new Error('--text is required unless both --no-tts and --no-motion are used')
}

const requestJson = async (endpoint) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 120000)
  try {
    const response = await fetch(`${apiBase}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ msg: text }),
      signal: controller.signal
    })
    if (!response.ok) {
      throw new Error(`${endpoint} failed with HTTP ${response.status}`)
    }
    return response.json()
  } finally {
    clearTimeout(timeout)
  }
}

const readWavDuration = (buffer) => {
  if (buffer.length < 44 || buffer.toString('ascii', 0, 4) !== 'RIFF') return 0
  let format = null
  let dataLength = 0
  for (let offset = 12; offset + 8 <= buffer.length; ) {
    const id = buffer.toString('ascii', offset, offset + 4)
    const size = buffer.readUInt32LE(offset + 4)
    const body = offset + 8
    if (id === 'fmt ' && size >= 16 && body + size <= buffer.length) {
      format = {
        audioFormat: buffer.readUInt16LE(body),
        channels: buffer.readUInt16LE(body + 2),
        sampleRate: buffer.readUInt32LE(body + 4),
        bitsPerSample: buffer.readUInt16LE(body + 14)
      }
    }
    if (id === 'data' && body + size <= buffer.length) dataLength = size
    offset = body + size + (size % 2)
  }
  if (!format || !format.channels || !format.sampleRate || !format.bitsPerSample) return 0
  return dataLength / (format.channels * (format.bitsPerSample / 8) * format.sampleRate)
}

const createMouthCues = (buffer, durationSeconds) => {
  if (buffer.length < 44 || buffer.toString('ascii', 0, 4) !== 'RIFF') return []
  let format = null
  let dataStart = 0
  let dataLength = 0
  for (let offset = 12; offset + 8 <= buffer.length; ) {
    const id = buffer.toString('ascii', offset, offset + 4)
    const size = buffer.readUInt32LE(offset + 4)
    const body = offset + 8
    if (id === 'fmt ' && size >= 16 && body + size <= buffer.length) {
      format = {
        audioFormat: buffer.readUInt16LE(body),
        channels: buffer.readUInt16LE(body + 2),
        sampleRate: buffer.readUInt32LE(body + 4),
        bitsPerSample: buffer.readUInt16LE(body + 14)
      }
    }
    if (id === 'data' && body + size <= buffer.length) {
      dataStart = body
      dataLength = size
      break
    }
    offset = body + size + (size % 2)
  }
  if (!format || !dataLength || ![1, 3].includes(format.audioFormat)) return []

  const bytesPerSample = format.bitsPerSample / 8
  if (![1, 2, 3, 4].includes(bytesPerSample)) return []
  const frameBytes = bytesPerSample * format.channels
  const totalSamples = Math.floor(dataLength / frameBytes)
  const cueCount = Math.ceil(durationSeconds * fps)
  const cues = []
  let previous = 0
  const sampleAt = (index, channel) => {
    const offset = dataStart + (index * format.channels + channel) * bytesPerSample
    if (format.audioFormat === 3 && bytesPerSample === 4) return buffer.readFloatLE(offset)
    if (bytesPerSample === 1) return (buffer.readUInt8(offset) - 128) / 128
    if (bytesPerSample === 2) return buffer.readInt16LE(offset) / 32768
    if (bytesPerSample === 3) {
      const value = buffer.readUIntLE(offset, 3)
      return (value & 0x800000 ? value - 0x1000000 : value) / 0x800000
    }
    return buffer.readInt32LE(offset) / 0x80000000
  }

  for (let frame = 0; frame < cueCount; frame++) {
    const start = Math.floor((frame / fps) * format.sampleRate)
    const end = Math.min(totalSamples, Math.floor(((frame + 1) / fps) * format.sampleRate))
    let sum = 0
    let count = 0
    for (let sample = start; sample < end; sample++) {
      for (let channel = 0; channel < format.channels; channel++) {
        const value = sampleAt(sample, channel)
        sum += value * value
        count++
      }
    }
    const rms = count ? Math.sqrt(sum / count) : 0
    const target = Math.max(0, Math.min(1, (rms - 0.015) * 7.5))
    previous = previous * 0.38 + target * 0.62
    cues.push(Number(previous.toFixed(4)))
  }
  return cues
}

const normalizeMotion = (response) => {
  const source = response?.motion
  if (
    !source ||
    typeof source !== 'object' ||
    !source.curves ||
    typeof source.curves !== 'object'
  ) {
    return undefined
  }
  const fpsValue = Number(source.fps)
  const durationMs = Number(source.duration ?? source.durationMs)
  if (
    !Number.isFinite(fpsValue) ||
    fpsValue <= 0 ||
    !Number.isFinite(durationMs) ||
    durationMs <= 0
  ) {
    return undefined
  }
  const curves = Object.fromEntries(
    Object.entries(source.curves).filter(
      ([, values]) => Array.isArray(values) && values.every((value) => Number.isFinite(value))
    )
  )
  return Object.keys(curves).length ? { curves, fps: fpsValue, durationMs } : undefined
}

let ttsResponse
let motionResponse
if (fromPropsPath) {
  const sourceProps = JSON.parse(await readFile(path.resolve(fromPropsPath), 'utf8'))
  const sourceAudioPath = typeof sourceProps.audioPath === 'string' ? sourceProps.audioPath : ''
  const sourceAudioFile = sourceAudioPath ? path.join(publicDir, sourceAudioPath) : ''
  const sourceAudio = sourceAudioFile ? await readFile(sourceAudioFile) : null
  ttsResponse = sourceAudio ? { file: sourceAudio.toString('base64') } : undefined
  if (sourceProps.motion) {
    motionResponse = {
      motion: {
        ...sourceProps.motion,
        duration: sourceProps.motion.duration ?? sourceProps.motion.durationMs
      }
    }
  }
} else {
  ;[ttsResponse, motionResponse] = await Promise.all([
    useTts ? requestJson('/api/gptsovits') : Promise.resolve(undefined),
    useMotion ? requestJson('/api/generate_motion') : Promise.resolve(undefined)
  ])
}

const assetDir = path.join(publicDir, 'live2d-generated', name)
await mkdir(assetDir, { recursive: true })

let audioPath
let audioDuration = 0
let mouthCues = []
if (typeof ttsResponse?.file === 'string' && ttsResponse.file.length > 0) {
  const audio = Buffer.from(ttsResponse.file, 'base64')
  await writeFile(path.join(assetDir, 'voice.wav'), audio)
  audioPath = `live2d-generated/${name}/voice.wav`
  audioDuration = readWavDuration(audio)
  mouthCues = createMouthCues(audio, Math.max(audioDuration, 0))
} else if (useTts) {
  console.warn('TTS returned no audio; rendering motion without voice.')
}

const motion = normalizeMotion(motionResponse)

// 睡眠模式：参考 Live2DSleepController，覆盖眼部参数。
// 说话时眼睛半睁 + 视线游移（半醒对话），不说话时闭眼并带低频微动，
// 同时压低头部/身体动作幅度，模拟睡眠状态下的静止感。
if (sleepMode && motion) {
  const motionFps = Number(motion.fps) || 30
  const curveLengths = Object.values(motion.curves).map((values) =>
    Array.isArray(values) ? values.length : 0
  )
  const frameCount = Math.max(
    ...curveLengths,
    Math.ceil((Math.max(minimumSeconds, audioDuration, motion.durationMs / 1000) + 0.25) * motionFps) + 1
  )
  const isSpeaking = (frameIndex) => {
    const cueIndex = Math.min(
      mouthCues.length - 1,
      Math.max(0, Math.round((frameIndex / motionFps) * fps))
    )
    return (mouthCues[cueIndex] ?? 0) > 0.045
  }
  const eyeLOpen = []
  const eyeROpen = []
  const eyeBallX = []
  const eyeBallY = []
  let openness = 0
  for (let i = 0; i < frameCount; i++) {
    const speaking = isSpeaking(i)
    const wander = Math.sin(i * 0.045) * 0.45
    const target = speaking ? 0.34 + wander * 0.14 : 0
    openness += (target - openness) * (speaking ? 0.32 : 0.08)
    // 睡眠微动：偶尔短暂睁眼再闭回（约每 8 秒一次）
    if (!speaking && i % 240 >= 104 && i % 240 < 112) {
      openness = Math.max(openness, 0.08)
    }
    eyeLOpen.push(Math.max(0, Math.min(0.8, openness)))
    eyeROpen.push(Math.max(0, Math.min(0.8, openness * 0.96)))
    eyeBallX.push(speaking ? Math.sin(i * 0.02) * 0.18 : 0)
    eyeBallY.push(speaking ? -0.06 + Math.cos(i * 0.025) * 0.08 : 0)
  }
  motion.curves.ParamEyeLOpen = eyeLOpen
  motion.curves.ParamEyeROpen = eyeROpen
  motion.curves.ParamEyeBallX = eyeBallX
  motion.curves.ParamEyeBallY = eyeBallY
  for (const paramId of [
    'ParamAngleX',
    'ParamAngleY',
    'ParamAngleZ',
    'ParamBodyAngleX',
    'ParamBodyAngleY',
    'ParamBodyAngleZ'
  ]) {
    if (Array.isArray(motion.curves[paramId])) {
      motion.curves[paramId] = motion.curves[paramId].map((value) => value * 0.25)
    }
  }
}

const motionDuration = motion ? motion.durationMs / 1000 : 0
const durationSeconds = Math.max(minimumSeconds, audioDuration, motionDuration, 1) + 0.25
const durationInFrames = Math.ceil(durationSeconds * fps)
if (mouthCues.length < durationInFrames) {
  mouthCues.push(...Array(durationInFrames - mouthCues.length).fill(0))
}

const renderProps = {
  durationInFrames,
  audioPath,
  motion,
  mouthCues,
  background
}
const characterFile = background === 'transparent' ? 'character.webm' : 'character.mp4'
const manifest = {
  text,
  createdAt: new Date().toISOString(),
  apiBase,
  durationSeconds: durationInFrames / fps,
  characterFile,
  ...renderProps
}
const propsPath = path.join(assetDir, 'render-props.json')
await writeFile(propsPath, `${JSON.stringify(renderProps)}\n`)
await writeFile(path.join(assetDir, 'source.json'), `${JSON.stringify(manifest, null, 2)}\n`)

const outputPath = path.join(assetDir, characterFile)
const remotionCli = path.join(root, 'node_modules', '@remotion', 'cli', 'remotion-cli.js')
const renderArgs = [
  'render',
  'Live2DAsset',
  outputPath,
  '--props',
  propsPath,
  '--concurrency=1',
  background === 'transparent' ? '--codec=vp9' : '--codec=h264',
  background === 'transparent' ? '--image-format=png' : '--image-format=jpeg',
  background === 'transparent' ? '--pixel-format=yuva420p' : '--pixel-format=yuv420p'
]
const result = spawnSync(process.execPath, [remotionCli, ...renderArgs], {
  cwd: root,
  stdio: 'inherit'
})
if (result.status !== 0) {
  process.exit(result.status ?? 1)
}

console.log(`Created ${path.relative(root, outputPath)}`)
