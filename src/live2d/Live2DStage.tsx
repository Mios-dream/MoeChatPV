import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { continueRender, delayRender, staticFile, useVideoConfig } from 'remotion'

type EngineModule = typeof import('untitled-pixi-live2d-engine')

export type GeneratedMotion = {
  curves: Record<string, number[]>
  fps: number
  durationMs: number
}

let enginePromise: Promise<EngineModule> | null = null

const MODEL_PATH = 'live2d/重置版智乃/智乃.model3.json'
const IDLE_MOTION_PATH = 'live2d/重置版智乃/motions/idle.motion3.json'

const loadCubismCore = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const w = window as unknown as {
      Live2DCubismCore?: unknown
      Live2D?: unknown
    }
    if (w.Live2DCubismCore && w.Live2D) {
      resolve()
      return
    }
    const load = (src: string): Promise<void> =>
      new Promise((res, rej) => {
        const s = document.createElement('script')
        s.src = src
        s.onload = () => res()
        s.onerror = () => rej(new Error(`script load failed: ${src}`))
        document.head.appendChild(s)
      })
    const pending: Promise<void>[] = []
    if (!w.Live2DCubismCore) {
      pending.push(load(staticFile('live2d/live2dcubismcore.min.js')))
    }
    if (!w.Live2D) {
      pending.push(load(staticFile('live2d/live2d.min.js')))
    }
    Promise.all(pending).then(() => resolve(), reject)
  })
}

const getEngine = (): Promise<EngineModule> => {
  if (!enginePromise) {
    enginePromise = loadCubismCore().then(() => import('untitled-pixi-live2d-engine'))
  }
  return enginePromise
}

type MotionManager = {
  state: { shouldRequestIdleMotion?: () => boolean }
  update?: (coreModel: object, now: number) => boolean
  createMotion?: (
    data: ArrayBuffer,
    group: string,
    definition: Record<string, unknown>
  ) => Record<string, unknown> | null
  _startMotion?: (motion: Record<string, unknown>) => void
}

const motionDefinition = (fadeInSeconds: number) => ({
  FadeInTime: fadeInSeconds,
  FadeOutTime: 0,
  File: ''
})

const startMotion = (
  motionManager: MotionManager,
  data: ArrayBuffer,
  group: string,
  fadeInSeconds: number
) => {
  const motion = motionManager.createMotion?.(data, group, motionDefinition(fadeInSeconds))
  if (motion) {
    motionManager._startMotion?.(motion)
  }
}

const buildMotion3Json = (motion: GeneratedMotion): ArrayBuffer | null => {
  const validCurves = Object.entries(motion.curves).filter(
    ([, samples]) => Array.isArray(samples) && samples.length >= 2
  )
  if (validCurves.length === 0 || !Number.isFinite(motion.fps) || motion.fps <= 0) {
    return null
  }

  const durationSeconds = Math.max(
    motion.durationMs / 1000,
    ...validCurves.map(([, samples]) => (samples.length - 1) / motion.fps)
  )
  const payload = {
    Version: 3,
    Meta: {
      Duration: durationSeconds,
      Fps: motion.fps,
      Loop: false,
      CurveCount: validCurves.length,
      TotalSegmentCount: validCurves.reduce((sum, [, samples]) => sum + samples.length - 1, 0),
      TotalPointCount: validCurves.reduce((sum, [, samples]) => sum + samples.length, 0),
      AreBeziersRestricted: 0,
      FadeInTime: 0.25,
      FadeOutTime: 0.25
    },
    Curves: validCurves.map(([id, samples]) => ({
      Target: 'Parameter',
      Id: id,
      Segments: samples.flatMap((value, index) =>
        index === 0 ? [0, value] : [0, index / motion.fps, value]
      )
    }))
  }
  return new TextEncoder().encode(JSON.stringify(payload)).buffer
}

const normalizeCubismId = (idHandle: unknown): string | null => {
  if (!idHandle) return null
  if (typeof idHandle === 'string') return idHandle
  if (typeof idHandle === 'object' && 'getString' in idHandle) {
    const getString = (idHandle as { getString?: unknown }).getString
    if (typeof getString === 'function') {
      const raw = (getString as () => unknown).call(idHandle)
      if (typeof raw === 'string') return raw
      if (raw && typeof raw === 'object' && 's' in raw) {
        const value = (raw as { s?: unknown }).s
        if (typeof value === 'string') return value
      }
    }
  }
  return null
}

const setMouthOpen = (coreModel: unknown, value: number) => {
  const model = coreModel as {
    getParameterCount?: () => number
    getParameterId?: (index: number) => unknown
    setParameterValueByIndex?: (index: number, value: number, weight?: number) => void
    setParameterValueById?: (id: unknown, value: number, weight?: number) => void
    update?: () => void
  }
  const clamped = Math.max(0, Math.min(1, value))
  const count = model.getParameterCount?.() ?? 0
  for (let index = 0; index < count; index += 1) {
    if (normalizeCubismId(model.getParameterId?.(index)) !== 'ParamMouthOpenY') continue
    model.setParameterValueByIndex?.(index, clamped, 1)
    return
  }
}

export const Live2DStage: React.FC<{
  width?: number
  height?: number
  targetTime: number
  motion?: GeneratedMotion
  mouthCues?: number[]
}> = ({ width = 980, height = 980, targetTime, motion, mouthCues }) => {
  const { fps } = useVideoConfig()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const targetRef = useRef(targetTime)
  const timeRef = useRef(0)
  const appRef = useRef<import('pixi.js').Application | null>(null)
  const modelRef = useRef<import('untitled-pixi-live2d-engine').Live2DModel | null>(null)
  const mouthCueRef = useRef(0)
  const [ready, setReady] = useState(false)

  targetRef.current = targetTime

  // The asset composition renders with one worker, keeping mutable Cubism
  // physics state sequential instead of sharing it with the main PV render.
  useLayoutEffect(() => {
    if (!ready) return
    const app = appRef.current
    const model = modelRef.current
    if (!app || !model) return
    const t = targetRef.current
    const framesToAdvance = Math.round((t - timeRef.current) * fps)
    if (framesToAdvance < 0) return

    if (mouthCues && mouthCues.length > 0) {
      const cueIndex = Math.min(mouthCues.length - 1, Math.max(0, Math.round(t * fps)))
      mouthCueRef.current = mouthCues[cueIndex] ?? 0
    } else {
      mouthCueRef.current = 0
    }

    for (let i = 0; i < framesToAdvance; i++) {
      model.update(1000 / fps)
    }
    timeRef.current += framesToAdvance / fps
    app.render()
  }, [fps, mouthCues, ready, targetTime])

  useEffect(() => {
    let disposed = false
    const handle = delayRender('Live2DStage: loading model')
    let app: import('pixi.js').Application | null = null
    let model: import('untitled-pixi-live2d-engine').Live2DModel | null = null

    ;(async () => {
      try {
        const [{ Application }, { Live2DModel }] = await Promise.all([
          import('pixi.js'),
          getEngine()
        ])
        if (disposed || !canvasRef.current) {
          continueRender(handle)
          return
        }

        const canvas = canvasRef.current
        app = new Application()
        await app.init({
          preference: 'webgl',
          canvas,
          backgroundAlpha: 0,
          preserveDrawingBuffer: true,
          antialias: false,
          autoStart: false,
          resolution: 1,
          width,
          height
        })

        model = await Live2DModel.from(staticFile(MODEL_PATH), {
          autoFocus: false,
          autoHitTest: false,
          autoUpdate: false
        })
        app.stage.addChild(model)

        const bounds = model.getLocalBounds()
        const scale = (height * 0.9) / bounds.height
        model.scale.set(scale)
        model.pivot.set(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
        model.position.set(width / 2, height - (bounds.height * scale) / 2 - 16)

        const motionManager = model.internalModel.motionManager as unknown as MotionManager
        motionManager.state.shouldRequestIdleMotion = () => false

        // The model manifest has no Motions entry, so load its idle motion
        // explicitly instead of modifying the model or relying on auto-idle.
        const idleData = await fetch(staticFile(IDLE_MOTION_PATH)).then((response) => {
          if (!response.ok) throw new Error(`idle motion request failed: ${response.status}`)
          return response.arrayBuffer()
        })
        startMotion(motionManager, idleData, 'pv-idle', 0.25)

        const generatedMotion = motion ? buildMotion3Json(motion) : null
        if (generatedMotion) {
          startMotion(motionManager, generatedMotion, 'pv-generated', 0.25)
        }

        const updateMotion = motionManager.update
        if (updateMotion) {
          motionManager.update = (coreModel, now) => {
            const result = updateMotion.call(motionManager, coreModel, now)
            setMouthOpen(coreModel, mouthCueRef.current)
            return result
          }
        }

        appRef.current = app
        modelRef.current = model
        timeRef.current = 0
        model.update(0)
        mouthCueRef.current = mouthCues?.[0] ?? 0
        app.render()
        if (!disposed) setReady(true)
        continueRender(handle)
      } catch (err) {
        console.error('[Live2DStage] init failed', err)
        continueRender(handle)
      }
    })()

    return () => {
      disposed = true
      try {
        model?.destroy()
        app?.destroy({ removeView: true }, { children: true })
      } catch {
        // Ignore teardown errors from a partially initialized WebGL context.
      }
    }
  }, [height, motion, mouthCues, width])

  return (
    <div style={{ position: 'relative', width, height }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          position: 'absolute',
          inset: 0,
          width,
          height,
          display: ready ? 'block' : 'none'
        }}
      />
    </div>
  )
}
