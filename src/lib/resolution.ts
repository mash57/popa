import type { Product, Photo, ResolutionRating } from '../types'

export function getResolutionRating(photo: Photo, product: Product): ResolutionRating {
  const requiredW = (product.printSizeMM.w / 25.4) * 300
  const requiredH = (product.printSizeMM.h / 25.4) * 300

  const scaleW = photo.width / requiredW
  const scaleH = photo.height / requiredH
  const scale = Math.min(scaleW, scaleH)

  if (scale >= 1.25) return 'green'
  if (scale >= 1.0) return 'amber'
  return 'red'
}

export const resolutionEmoji: Record<ResolutionRating, string> = {
  green: '🟢',
  amber: '🟡',
  red: '🔴',
}
