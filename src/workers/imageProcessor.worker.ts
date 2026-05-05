interface ProcessRequest {
  imageUrl: string
  targetWidth: number
  targetHeight: number
}

interface ProcessResponse {
  blob: Blob
  width: number
  height: number
  error?: string
}

self.onmessage = async (e: MessageEvent<ProcessRequest>) => {
  const { imageUrl, targetWidth, targetHeight } = e.data

  try {
    const res = await fetch(imageUrl)
    const blob = await res.blob()
    const bitmap = await createImageBitmap(blob)

    const canvas = new OffscreenCanvas(targetWidth, targetHeight)
    const ctx = canvas.getContext('2d')!

    // Cover-fit: scale to fill the target zone, centred
    const scaleX = targetWidth / bitmap.width
    const scaleY = targetHeight / bitmap.height
    const scale = Math.max(scaleX, scaleY)

    const drawW = bitmap.width * scale
    const drawH = bitmap.height * scale
    const dx = (targetWidth - drawW) / 2
    const dy = (targetHeight - drawH) / 2

    ctx.drawImage(bitmap, dx, dy, drawW, drawH)
    bitmap.close()

    const outputBlob = await canvas.convertToBlob({ type: 'image/webp', quality: 0.92 })
    const response: ProcessResponse = { blob: outputBlob, width: targetWidth, height: targetHeight }
    self.postMessage(response, [])
  } catch (err) {
    const response: ProcessResponse = {
      blob: new Blob(),
      width: 0,
      height: 0,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
    self.postMessage(response)
  }
}
