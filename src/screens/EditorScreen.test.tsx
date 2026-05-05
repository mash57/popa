import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EditorScreen } from './EditorScreen'
import { AppStateProvider } from '../lib/appState'
import type { Product, Photo, AppState } from '../types'

const mockProduct: Product = {
  id: 'canvas-8x10', label: 'Canvas Wrap', category: 'canvas',
  mockupPath: '/mockups/canvas-8x10', printSizeMM: { w: 203, h: 254 },
  minResolutionPx: { w: 2400, h: 3000 }, priceFrom: 29, currency: 'USD', shipsIn: 7,
}

const mockPhoto: Photo = {
  id: 'p1', thumbnailUrl: 'thumb.jpg', fullResUrl: 'full.jpg', width: 3000, height: 4000,
}

const editorInitial: Partial<AppState> = {
  screen: 'editor',
  selectedProduct: mockProduct,
  selectedPhoto: mockPhoto,
}

function renderEditor() {
  return render(
    <AppStateProvider initialState={editorInitial}>
      <EditorScreen />
    </AppStateProvider>
  )
}

describe('EditorScreen', () => {
  it('renders all tool chips', () => {
    renderEditor()
    expect(screen.getByTestId('tool-crop')).toBeInTheDocument()
    expect(screen.getByTestId('tool-brightness')).toBeInTheDocument()
    expect(screen.getByTestId('tool-contrast')).toBeInTheDocument()
    expect(screen.getByTestId('tool-warmth')).toBeInTheDocument()
    expect(screen.getByTestId('tool-text')).toBeInTheDocument()
  })

  it('shows crop handles by default', () => {
    renderEditor()
    expect(screen.getByTestId('crop-handle-top-left')).toBeInTheDocument()
    expect(screen.getByTestId('crop-handle-top-right')).toBeInTheDocument()
    expect(screen.getByTestId('crop-handle-bottom-left')).toBeInTheDocument()
    expect(screen.getByTestId('crop-handle-bottom-right')).toBeInTheDocument()
  })

  it('shows slider for non-text tools', () => {
    renderEditor()
    expect(screen.getByTestId('tool-slider')).toBeInTheDocument()
  })

  it('switches to text input when Text chip is tapped', () => {
    renderEditor()
    fireEvent.click(screen.getByTestId('tool-text'))
    expect(screen.getByTestId('text-input')).toBeInTheDocument()
  })

  it('hides slider when Text chip is active', () => {
    renderEditor()
    fireEvent.click(screen.getByTestId('tool-text'))
    expect(screen.queryByTestId('tool-slider')).not.toBeInTheDocument()
  })

  it('renders back and add-to-order buttons', () => {
    renderEditor()
    expect(screen.getByTestId('back-button')).toBeInTheDocument()
    expect(screen.getByTestId('add-to-order-button')).toBeInTheDocument()
  })

  it('slider updates value on change', () => {
    renderEditor()
    const slider = screen.getByRole('slider', { name: /crop adjustment/i })
    fireEvent.change(slider, { target: { value: '50' } })
    expect(slider).toHaveValue('50')
  })
})
