import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AppStateProvider, useAppState } from './appState'
import type { Product, Photo } from '../types'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppStateProvider>{children}</AppStateProvider>
)

const mockProduct: Product = {
  id: 'canvas-8x10',
  label: 'Canvas Wrap',
  category: 'canvas',
  mockupPath: '/mockups/canvas-8x10',
  printSizeMM: { w: 203, h: 254 },
  minResolutionPx: { w: 2400, h: 3000 },
  priceFrom: 29,
  currency: 'USD',
  shipsIn: 7,
}

const mockPhoto: Photo = {
  id: 'photo-1',
  thumbnailUrl: 'thumb.jpg',
  fullResUrl: 'full.jpg',
  width: 3000,
  height: 4000,
}

describe('AppState', () => {
  it('starts on the home screen', () => {
    const { result } = renderHook(() => useAppState(), { wrapper })
    expect(result.current.state.screen).toBe('home')
  })

  it('navigates to gallery screen', () => {
    const { result } = renderHook(() => useAppState(), { wrapper })
    act(() => result.current.dispatch({ type: 'NAVIGATE', screen: 'gallery' }))
    expect(result.current.state.screen).toBe('gallery')
  })

  it('selects a product', () => {
    const { result } = renderHook(() => useAppState(), { wrapper })
    act(() => result.current.dispatch({ type: 'SELECT_PRODUCT', product: mockProduct }))
    expect(result.current.state.selectedProduct?.id).toBe('canvas-8x10')
  })

  it('selects a photo', () => {
    const { result } = renderHook(() => useAppState(), { wrapper })
    act(() => result.current.dispatch({ type: 'SELECT_PHOTO', photo: mockPhoto }))
    expect(result.current.state.selectedPhoto?.id).toBe('photo-1')
  })

  it('grants permission', () => {
    const { result } = renderHook(() => useAppState(), { wrapper })
    act(() => result.current.dispatch({ type: 'SET_PERMISSION', granted: true }))
    expect(result.current.state.permissionGranted).toBe(true)
  })

  it('updates brightness adjustment', () => {
    const { result } = renderHook(() => useAppState(), { wrapper })
    act(() =>
      result.current.dispatch({ type: 'UPDATE_ADJUSTMENT', key: 'brightness', value: 20 })
    )
    expect(result.current.state.editorAdjustments.brightness).toBe(20)
  })
})
