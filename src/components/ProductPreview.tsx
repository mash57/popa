import { useEffect, useRef, useState } from 'react'
import type { ProductConfig } from '../types'

interface Props {
  photoUrl: string
  config: ProductConfig
  baseUrl: string
  overlayUrl: string
  className?: string
}

export function ProductPreview({ photoUrl, config, baseUrl, overlayUrl, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!photoUrl) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    setReady(false)

    const { baseSize, photoZone, overlayBlendMode } = config

    canvas.width = baseSize.w
    canvas.height = baseSize.h

    Promise.all([
      loadImage(baseUrl),
      loadImage(photoUrl),
      loadImage(overlayUrl),
    ]).then(([base, photo, overlay]) => {
      // Draw base product shot
      ctx.drawImage(base, 0, 0, baseSize.w, baseSize.h)

      // Draw user photo into the photo zone (cover-fit)
      ctx.save()
      const { x, y, width, height, borderRadius } = photoZone
      roundedRect(ctx, x, y, width, height, borderRadius)
      ctx.clip()

      const scaleX = width / photo.naturalWidth
      const scaleY = height / photo.naturalHeight
      const scale = Math.max(scaleX, scaleY)
      const drawW = photo.naturalWidth * scale
      const drawH = photo.naturalHeight * scale
      const dx = x + (width - drawW) / 2
      const dy = y + (height - drawH) / 2
      ctx.drawImage(photo, dx, dy, drawW, drawH)
      ctx.restore()

      // Draw overlay (shadow/glare) using multiply blend
      ctx.globalCompositeOperation = overlayBlendMode
      ctx.drawImage(overlay, 0, 0, baseSize.w, baseSize.h)
      ctx.globalCompositeOperation = 'source-over'

      setReady(true)
    }).catch(console.error)
  }, [photoUrl, config, baseUrl, overlayUrl])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.2s ease' }}
      data-testid="product-preview-canvas"
    />
  )
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}
