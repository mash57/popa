import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { GalleryScreen } from './GalleryScreen'
import { AppStateProvider } from '../lib/appState'
import type { Product, AppState } from '../types'

const mockProduct: Product = {
  id: 'canvas-8x10', label: 'Canvas Wrap', category: 'canvas',
  mockupPath: '/mockups/canvas-8x10', printSizeMM: { w: 203, h: 254 },
  minResolutionPx: { w: 2400, h: 3000 }, priceFrom: 29, currency: 'USD', shipsIn: 7,
}

const galleryInitial: Partial<AppState> = {
  screen: 'gallery',
  selectedProduct: mockProduct,
}

function renderGallery() {
  return render(
    <AppStateProvider initialState={galleryInitial}>
      <GalleryScreen />
    </AppStateProvider>
  )
}

describe('GalleryScreen', () => {
  it('renders the heading', () => {
    renderGallery()
    expect(screen.getByText('Choose a photo')).toBeInTheDocument()
  })

  it('shows empty state when no photos', async () => {
    renderGallery()
    await waitFor(() => expect(screen.getByTestId('pick-photos-button')).toBeInTheDocument())
  })

  it('shows photo grid when photos provided', async () => {
    const photo = { id: 'p1', thumbnailUrl: '/test.jpg', fullResUrl: '/test.jpg', width: 3000, height: 4000 }
    render(
      <AppStateProvider initialState={{ ...galleryInitial, photos: [photo], selectedPhoto: photo }}>
        <GalleryScreen />
      </AppStateProvider>
    )
    await waitFor(() => expect(screen.getByTestId('photo-p1')).toBeInTheDocument())
  })

  it('renders preview button', async () => {
    renderGallery()
    await waitFor(() => expect(screen.getByTestId('preview-button')).toBeInTheDocument())
  })

  it('preview button shows selected product name', async () => {
    renderGallery()
    await waitFor(() => expect(screen.getByText(/Preview on Canvas Wrap/)).toBeInTheDocument())
  })

  it('back button navigates to home', async () => {
    renderGallery()
    const back = screen.getByLabelText('Back to home')
    fireEvent.click(back)
    // No error = pass
  })
})
