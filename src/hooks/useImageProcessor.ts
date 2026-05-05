import { useRef, useCallback } from 'react'

interface ProcessedImage {
  blobUrl: string
  width: number
  height: number
}

export function useImageProcessor() {
  const workerRef = useRef<Worker | null>(null)

  function getWorker(): Worker {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('../workers/imageProcessor.worker.ts', import.meta.url),
        { type: 'module' }
      )
    }
    return workerRef.current
  }

  const process = useCallback(
    (imageUrl: string, targetWidth: number, targetHeight: number): Promise<ProcessedImage> => {
      return new Promise((resolve, reject) => {
        const worker = getWorker()
        worker.onmessage = (e) => {
          const { blob, width, height, error } = e.data
          if (error) { reject(new Error(error)); return }
          const blobUrl = URL.createObjectURL(blob)
          resolve({ blobUrl, width, height })
        }
        worker.onerror = (e) => reject(new Error(e.message))
        worker.postMessage({ imageUrl, targetWidth, targetHeight })
      })
    },
    []
  )

  const terminate = useCallback(() => {
    workerRef.current?.terminate()
    workerRef.current = null
  }, [])

  return { process, terminate }
}
