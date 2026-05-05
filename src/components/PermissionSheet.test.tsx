import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PermissionSheet } from './PermissionSheet'

describe('PermissionSheet', () => {
  it('renders when open', () => {
    render(<PermissionSheet open onAllow={vi.fn()} onDeny={vi.fn()} />)
    expect(screen.getByText(/"popa" would like to access your photos/)).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<PermissionSheet open={false} onAllow={vi.fn()} onDeny={vi.fn()} />)
    expect(screen.queryByText(/"popa" would like to access your photos/)).not.toBeInTheDocument()
  })

  it('calls onAllow when Allow Access is tapped', () => {
    const onAllow = vi.fn()
    render(<PermissionSheet open onAllow={onAllow} onDeny={vi.fn()} />)
    fireEvent.click(screen.getByText('Allow Access'))
    expect(onAllow).toHaveBeenCalledOnce()
  })

  it('calls onDeny when Don\'t allow is tapped', () => {
    const onDeny = vi.fn()
    render(<PermissionSheet open onAllow={vi.fn()} onDeny={onDeny} />)
    fireEvent.click(screen.getByText("Don't allow"))
    expect(onDeny).toHaveBeenCalledOnce()
  })

  it('shows privacy footnote', () => {
    render(<PermissionSheet open onAllow={vi.fn()} onDeny={vi.fn()} />)
    expect(screen.getByText(/Your photos never leave your device/)).toBeInTheDocument()
  })
})
