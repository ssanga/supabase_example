import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ConfirmDialog from '../../components/ConfirmDialog'

describe('ConfirmDialog', () => {
  it('renders nothing when open is false', () => {
    const { container } = render(
      <ConfirmDialog open={false} message="Delete?" onConfirm={vi.fn()} onCancel={vi.fn()} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders message and title when open', () => {
    render(<ConfirmDialog open message="Are you sure?" onConfirm={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
    expect(screen.getByText('Confirm delete')).toBeInTheDocument()
  })

  it('calls onConfirm when Delete button is clicked', () => {
    const onConfirm = vi.fn()
    render(<ConfirmDialog open message="Delete?" onConfirm={onConfirm} onCancel={vi.fn()} />)
    fireEvent.click(screen.getByText('Delete'))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('calls onCancel when Cancel button is clicked', () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog open message="Delete?" onConfirm={vi.fn()} onCancel={onCancel} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('calls onCancel when backdrop is clicked', () => {
    const onCancel = vi.fn()
    const { container } = render(
      <ConfirmDialog open message="Delete?" onConfirm={vi.fn()} onCancel={onCancel} />
    )
    fireEvent.click(container.querySelector('.absolute')!)
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('shows Deleting text and disables button when loading', () => {
    render(<ConfirmDialog open message="Delete?" onConfirm={vi.fn()} onCancel={vi.fn()} loading />)
    const deleteBtn = screen.getByText('Deleting…')
    expect(deleteBtn).toBeInTheDocument()
    expect(deleteBtn).toBeDisabled()
  })

  it('Delete button is enabled when not loading', () => {
    render(<ConfirmDialog open message="Delete?" onConfirm={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('Delete')).not.toBeDisabled()
  })
})
