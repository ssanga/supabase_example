import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Modal from '../../components/Modal'

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal open={false} title="Test" onClose={vi.fn()}>
        <p>content</p>
      </Modal>
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders title and children when open', () => {
    render(
      <Modal open title="My Modal" onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>
    )
    expect(screen.getByText('My Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('calls onClose when X button is clicked', () => {
    const onClose = vi.fn()
    render(
      <Modal open title="Test" onClose={onClose}>
        <p>content</p>
      </Modal>
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    const { container } = render(
      <Modal open title="Test" onClose={onClose}>
        <p>content</p>
      </Modal>
    )
    fireEvent.click(container.querySelector('.absolute')!)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn()
    render(
      <Modal open title="Test" onClose={onClose}>
        <p>content</p>
      </Modal>
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not call onClose on other key presses', () => {
    const onClose = vi.fn()
    render(
      <Modal open title="Test" onClose={onClose}>
        <p>content</p>
      </Modal>
    )
    fireEvent.keyDown(document, { key: 'Enter' })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('does not listen to keydown when closed', () => {
    const onClose = vi.fn()
    render(
      <Modal open={false} title="Test" onClose={onClose}>
        <p>content</p>
      </Modal>
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
  })
})
