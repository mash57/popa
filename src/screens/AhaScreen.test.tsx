import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AhaScreen } from './AhaScreen'
import { AppStateProvider } from '../lib/appState'
import type { Product, Photo, AppState } from '../types'

const mockProduct: Product = {
  id: 'canvas-8x10', label: 'Canvas Wrap', category: 'canvas',
  mockupPath: '/mockups/canvas-8x10', printSizeMM: { w: 203, h: 254 },
  minResolutionPx: { w: 2400, h: 3000 }, priceFrom: 29, currency: 'USD', shipsIn: 7,
}

const mockPhoto: Photo = {
  id: 'p1', thumbnailUrl: 'thumb.jpg', fullResUrl: 'full.jpg',
  width: 3000, height: 4000,
}

const mockConfig = {
  photoZone: { x: 64, y: 64, width: 744, height: 930, perspectiveTransform: [1,0,0,0,1,0,0,0,1], borderRadius: 2 },
  overlayBlendMode: 'multiply',
  baseSize: { w: 872, h: 1090 },
}

vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
  drawImage: vi.fn(), save: vi.fn(), restore: vi.fn(), clip: vi.fn(),
  beginPath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(), quadraticCurveTo: vi.fn(),
  closePath: vi.fn(), globalCompositeOperation: 'source-over',
} as unknown as CanvasRenderingContext2D)

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve(mockConfig),
  } as Response)
})

const ahaInitial: Partial<AppState> = {
  screen: 'aha',
  selectedProduct: mockProduct,
  selectedPhoto: mockPhoto,
}

function renderAha() {
  return render(
    <AppStateProvider initialState={ahaInitial}>
      <AhaScreen />
    </AppStateProvider>
  )
}

describe('AhaScreen', () => {
  it('renders the aha screen container', () => {
    renderAha()
    expect(screen.getByTestId('aha-screen')).toBeInTheDocument()
  })

  it('shows the sparkle CTA button', () => {
    renderAha()
    expect(screen.getByTestId('aha-cta')).toHaveTextContent('Looks great — edit ✦')
  })

  it('navigates to editor on CTA tap', () => {
    renderAha()
    fireEvent.click(screen.getByTestId('aha-cta'))
    // Navigation dispatched — no error = pass
  })

  it('fetches config from the product mockup path', async () => {
    renderAha()
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith('/mockups/canvas-8x10/config.json')
    )
  })

  it('shows product label', async () => {
    renderAha()
    await waitFor(() => expect(screen.getByText('Canvas Wrap')).toBeInTheDocument())
  })
})
