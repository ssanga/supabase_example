import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import DepartmentForm from '../../components/departments/DepartmentForm'
import type { Department } from '../../types'

const mockDept: Department = {
  id: '1',
  name: 'Engineering',
  description: 'Builds software',
  location: 'Floor 3',
  budget: 500000,
  created_at: '2024-01-01',
}

describe('DepartmentForm', () => {
  it('renders Create department button for new form', () => {
    render(<DepartmentForm onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('Create department')).toBeInTheDocument()
  })

  it('renders Save changes button when editing', () => {
    render(<DepartmentForm initial={mockDept} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('Save changes')).toBeInTheDocument()
  })

  it('pre-fills fields with initial values', () => {
    render(<DepartmentForm initial={mockDept} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByDisplayValue('Engineering')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Builds software')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Floor 3')).toBeInTheDocument()
  })

  it('shows validation error when name is empty', async () => {
    render(<DepartmentForm onSubmit={vi.fn()} onCancel={vi.fn()} />)
    fireEvent.click(screen.getByText('Create department'))
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
    })
  })

  it('calls onSubmit with form data when valid', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<DepartmentForm onSubmit={onSubmit} onCancel={vi.fn()} />)
    await userEvent.type(screen.getByPlaceholderText('Engineering'), 'New Dept')
    fireEvent.click(screen.getByText('Create department'))
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'New Dept' })
      )
    })
  })

  it('calls onCancel when Cancel button is clicked', () => {
    const onCancel = vi.fn()
    render(<DepartmentForm onSubmit={vi.fn()} onCancel={onCancel} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('displays API error message when onSubmit rejects', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('Server error'))
    render(<DepartmentForm onSubmit={onSubmit} onCancel={vi.fn()} />)
    await userEvent.type(screen.getByPlaceholderText('Engineering'), 'Test')
    fireEvent.click(screen.getByText('Create department'))
    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument()
    })
  })

  it('disables submit button while submitting', async () => {
    let resolve: () => void
    const onSubmit = vi.fn().mockReturnValue(new Promise<void>(r => { resolve = r }))
    render(<DepartmentForm onSubmit={onSubmit} onCancel={vi.fn()} />)
    await userEvent.type(screen.getByPlaceholderText('Engineering'), 'Test')
    fireEvent.click(screen.getByText('Create department'))
    await waitFor(() => {
      expect(screen.getByText('Saving…')).toBeDisabled()
    })
    resolve!()
  })
})
