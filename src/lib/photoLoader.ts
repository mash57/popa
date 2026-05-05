import type { Photo } from '../types'

function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = reject
    img.src = url
  })
}

export async function loadPhotosFromFiles(files: File[]): Promise<Photo[]> {
  const results = await Promise.all(
    files.map(async (file, i) => {
      const url = URL.createObjectURL(file)
      const { width, height } = await getImageDimensions(url)
      const photo: Photo = {
        id: `local-${Date.now()}-${i}`,
        thumbnailUrl: url,
        fullResUrl: url,
        width,
        height,
        takenAt: new Date(file.lastModified).toISOString(),
      }
      return photo
    })
  )
  // Sort newest first (by lastModified)
  return results.sort((a, b) =>
    new Date(b.takenAt!).getTime() - new Date(a.takenAt!).getTime()
  )
}
