// 快速校验：所有预览代理是否保留透明通道（alphaMin 应为 0，alphaMax 应为 255），
// 并抽查第 2 秒的帧内容是否正常（YAVG > 10 说明画面不是全黑/全透明）。
import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const names = [
  'chat-reply-1',
  'chat-reply-2',
  'chat-reply-3',
  'day-companion',
  'sleep-mode',
  'diary-secret',
  'widget-weather',
  'come-home'
]

let failed = false
for (const name of names) {
  const file = path.join(root, 'public', 'live2d-generated', name, 'character-preview.webm')
  const out = execSync(
    `ffmpeg -hide_banner -c:v libvpx-vp9 -i "${file}" -frames:v 1 -vf "alphaextract,signalstats,metadata=print:file=-" -f null - 2>nul`
  ).toString()
  const min = /YMIN=(\S+)/.exec(out)?.[1]
  const max = /YMAX=(\S+)/.exec(out)?.[1]
  const frame = execSync(
    `ffmpeg -hide_banner -c:v libvpx-vp9 -ss 2 -i "${file}" -frames:v 1 -vf "signalstats,metadata=print:file=-" -f null - 2>nul`
  ).toString()
  const yavg = Number(/YAVG=([\d.]+)/.exec(frame)?.[1] ?? 0)
  const ok = min === '0' && max === '255' && yavg > 10
  if (!ok) failed = true
  console.log(`${name}: alphaMin=${min} alphaMax=${max} frameYAVG=${yavg.toFixed(1)} ${ok ? 'OK' : 'BAD'}`)
}

process.exit(failed ? 1 : 0)
