import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import EmployeeForm from '../../components/employees/EmployeeForm'
import type { Department, Employee } from '../../types'

const departments: Department[] = [
  { id: 'd1', name: 'Engineering', description: null, location: null, budget: null, created_at: '2024-01-01' },
  { id: 'd2', name: 'HR', description: null, location: null, budget: null, created_at: '2024-01-02' },
]

const mockEmployee: Employee = {
  id: '1',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  phone: '+1-555-0100',
  position: 'Software Engineer',
  hire_date: '2023-06-15',
  salary: 95000,
  department_id: 'd1',
  created_at: '2023-06-15',
}

describe('EmployeeForm', () => {
  it('renders Add employee button for new form', () => {
    render(<EmployeeForm departments={departments} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('Add employee')).toBeInTheDocument()
  })

  it('renders Save changes button when editing', () => {
    render(
      <EmployeeForm initial={mockEmployee} departments={departments} onSubmit={vi.fn()} onCancel={vi.fn()} />
    )
    expect(screen.getByText('Save changes')).toBeInTheDocument()
  })

  it('pre-fills fields with initial values', () => {
    render(
      <EmployeeForm initial={mockEmployee} departments={departments} onSubmit={vi.fn()} onCancel={vi.fn()} />
    )
    expect(screen.getByDisplayValue('John')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Software Engineer')).toBeInTheDocument()
  })

  it('renders department options', () => {
    render(<EmployeeForm departments={departments} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('Engineering')).toBeInTheDocument()
    expect(screen.getByText('HR')).toBeInTheDocument()
    expect(screen.getByText('— No department —')).toBeInTheDocument()
  })

  it('shows validation errors when required fields are empty', async () => {
    render(<EmployeeForm departments={departments} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    fireEvent.click(screen.getByText('Add employee'))
    await waitFor(() => {
      const errors = screen.getAllByText('Required')
      expect(errors.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('calls onSubmit with form data when valid', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { container } = render(<EmployeeForm departments={departments} onSubmit={onSubmit} onCancel={vi.fn()} />)

    await userEvent.type(container.querySelector('input[name="first_name"]')!, 'Alice')
    await userEvent.type(container.querySelector('input[name="last_name"]')!, 'Wonder')
    await userEvent.type(container.querySelector('input[name="email"]')!, 'alice@example.com')
    await userEvent.type(container.querySelector('input[name="position"]')!, 'Designer')
    fireEvent.click(screen.getByText('Add employee'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          first_name: 'Alice',
          last_name: 'Wonder',
          email: 'alice@example.com',
          position: 'Designer',
        })
      )
    })
  })

  it('calls onCancel when Cancel button is clicked', () => {
    const onCancel = vi.fn()
    render(<EmployeeForm departments={departments} onSubmit={vi.fn()} onCancel={onCancel} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('displays API error when onSubmit rejects', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('Duplicate email'))
    const { container } = render(<EmployeeForm departments={departments} onSubmit={onSubmit} onCancel={vi.fn()} />)

    await userEvent.type(container.querySelector('input[name="first_name"]')!, 'Alice')
    await userEvent.type(container.querySelector('input[name="last_name"]')!, 'Wonder')
    await userEvent.type(container.querySelector('input[name="email"]')!, 'alice@example.com')
    await userEvent.type(container.querySelector('input[name="position"]')!, 'Designer')
    fireEvent.click(screen.getByText('Add employee'))

    await waitFor(() => {
      expect(screen.getByText('Duplicate email')).toBeInTheDocument()
    })
  })
})
