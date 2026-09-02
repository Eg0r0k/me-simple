import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue'
import * as THREE from 'three'

import vertShader from '@/shaders/dither.vert?raw'
import fragShader from '@/shaders/dither.frag?raw'

export interface DitherOptions {
  colorA?: string
  colorB?: string
  pxSize?: number
  ditherType?: number
  ditherStrength?: number
  videoSrc?: string
  imageSrc?: string
}

export interface DitherControls {
  colorA: Ref<string>
  colorB: Ref<string>
  pxSize: Ref<number>
  ditherType: Ref<number>
  ditherStrength: Ref<number>
}

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex)
  return new THREE.Vector3(c.r, c.g, c.b)
}

export function useDitherBackground(
  canvasRef: Ref<HTMLCanvasElement | null>,
  initialOptions: DitherOptions = {},
): DitherControls {
  const colorA = ref(initialOptions.colorA ?? '#111122')
  const colorB = ref(initialOptions.colorB ?? '#d4d4e8')
  const pxSize = ref(initialOptions.pxSize ?? 8)
  const ditherType = ref(initialOptions.ditherType ?? 3)
  const ditherStrength = ref(initialOptions.ditherStrength ?? 1.0)

  let renderer: THREE.WebGLRenderer | null = null
  let material: THREE.ShaderMaterial | null = null
  let animId: number | null = null
  let offscreen: HTMLCanvasElement | null = null
  let ctx: CanvasRenderingContext2D | null = null
  const clock = new THREE.Clock()

  function buildScene(visibleCanvas: HTMLCanvasElement) {
    const dpr = Math.min(window.devicePixelRatio, 4)
    const w = visibleCanvas.clientWidth
    const h = visibleCanvas.clientHeight
    if (w === 0 || h === 0) return
    const resolutionScale = 1.5
    const bw = Math.round(w * dpr * resolutionScale)
    const bh = Math.round(h * dpr * resolutionScale)

    visibleCanvas.width = bw
    visibleCanvas.height = bh

    offscreen = document.createElement('canvas')
    offscreen.width = bw
    offscreen.height = bh

    const glCtx = offscreen.getContext('webgl2', { antialias: false })
    if (!glCtx) return

    renderer = new THREE.WebGLRenderer({ canvas: offscreen, antialias: false, context: glCtx })
    renderer.setPixelRatio(1)
    renderer.setSize(bw, bh, false)

    ctx = visibleCanvas.getContext('2d')

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    let mediaTex: THREE.Texture
    let mediaAspect = 16 / 9

    if (initialOptions.imageSrc) {
      const img = new Image()
      img.src = initialOptions.imageSrc
      mediaTex = new THREE.Texture(img)
      mediaTex.minFilter = THREE.LinearFilter
      mediaTex.magFilter = THREE.LinearFilter
      img.onload = () => {
        mediaTex.needsUpdate = true
        mediaAspect = img.naturalWidth / img.naturalHeight
        const u = material?.uniforms as Record<string, THREE.IUniform>
        if (u) u.uMediaAspect!.value = mediaAspect
      }
    } else {
      const video = document.createElement('video')
      video.src = initialOptions.videoSrc ?? '/background.mp4'
      video.loop = true
      video.muted = true
      video.playsInline = true
      video.setAttribute('playsinline', '')
      video.play().catch(() => {})

      mediaTex = new THREE.VideoTexture(video)
      mediaTex.minFilter = THREE.LinearFilter
      mediaTex.magFilter = THREE.LinearFilter

      video.onloadedmetadata = () => {
        mediaAspect = video.videoWidth / video.videoHeight
        const u = material?.uniforms as Record<string, THREE.IUniform>
        if (u) u.uMediaAspect!.value = mediaAspect
      }
    }

    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(bw, bh) },
      uColorA: { value: hexToVec3(colorA.value) },
      uColorB: { value: hexToVec3(colorB.value) },
      uPxSize: { value: pxSize.value },
      uDitherType: { value: ditherType.value },
      uDitherStrength: { value: ditherStrength.value },
      uMediaTex: { value: mediaTex },
      uMediaAspect: { value: mediaAspect },
    } as Record<string, THREE.IUniform>
    material = new THREE.ShaderMaterial({
      vertexShader: vertShader,
      fragmentShader: fragShader,
      uniforms,
    })

    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material))

    function render() {
      animId = requestAnimationFrame(render)
      material!.uniforms.uTime!.value = clock.getElapsedTime()
      renderer!.render(scene, camera)
      ctx!.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height)
      ctx!.drawImage(offscreen!, 0, 0)
    }
    render()
  }

  function syncUniforms() {
    const m = material
    if (!m) return
    const u = m.uniforms as Record<string, THREE.IUniform>
    u.uColorA!.value = hexToVec3(colorA.value)
    u.uColorB!.value = hexToVec3(colorB.value)
    u.uPxSize!.value = pxSize.value
    u.uDitherType!.value = ditherType.value
    u.uDitherStrength!.value = ditherStrength.value
  }

  watch([colorA, colorB, pxSize, ditherType, ditherStrength], syncUniforms)

  onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return
    buildScene(canvas)
  })

  onUnmounted(() => {
    if (animId !== null) cancelAnimationFrame(animId)
    renderer?.dispose()
  })

  return { colorA, colorB, pxSize, ditherType, ditherStrength }
}
