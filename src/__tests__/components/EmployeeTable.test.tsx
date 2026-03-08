import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import EmployeeTable from '../../components/employees/EmployeeTable'
import type { Employee } from '../../types'

const dept = { id: 'd1', name: 'Engineering', description: null, location: null, budget: null, created_at: '2024-01-01' }

const mockEmployees: Employee[] = [
  {
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
    department: dept,
  },
  {
    id: '2',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane@example.com',
    phone: null,
    position: 'Product Manager',
    hire_date: null,
    salary: null,
    department_id: null,
    created_at: '2023-07-01',
    department: null,
  },
]

describe('EmployeeTable', () => {
  it('shows empty state when there are no employees', () => {
    render(<EmployeeTable employees={[]} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(/No employees yet/)).toBeInTheDocument()
  })

  it('renders employee full names', () => {
    render(<EmployeeTable employees={mockEmployees} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('renders employee emails', () => {
    render(<EmployeeTable employees={mockEmployees} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
  })

  it('renders initials avatar', () => {
    render(<EmployeeTable employees={mockEmployees} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('JD')).toBeInTheDocument()
    expect(screen.getByText('JS')).toBeInTheDocument()
  })

  it('renders department badge when department is set', () => {
    render(<EmployeeTable employees={mockEmployees} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Engineering')).toBeInTheDocument()
  })

  it('formats salary correctly', () => {
    render(<EmployeeTable employees={mockEmployees} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('$95,000')).toBeInTheDocument()
  })

  it('shows dash for null salary', () => {
    render(<EmployeeTable employees={mockEmployees} onEdit={vi.fn()} onDelete={vi.fn()} />)
    const dashes = screen.getAllByText('—')
    expect(dashes.length).toBeGreaterThanOrEqual(1)
  })

  it('calls onEdit with the correct employee', () => {
    const onEdit = vi.fn()
    render(<EmployeeTable employees={mockEmployees} onEdit={onEdit} onDelete={vi.fn()} />)
    const editButtons = screen.getAllByTitle('Edit')
    fireEvent.click(editButtons[0])
    expect(onEdit).toHaveBeenCalledWith(mockEmployees[0])
  })

  it('calls onDelete with the correct employee', () => {
    const onDelete = vi.fn()
    render(<EmployeeTable employees={mockEmployees} onEdit={vi.fn()} onDelete={onDelete} />)
    const deleteButtons = screen.getAllByTitle('Delete')
    fireEvent.click(deleteButtons[1])
    expect(onDelete).toHaveBeenCalledWith(mockEmployees[1])
  })

  it('renders table headers', () => {
    render(<EmployeeTable employees={mockEmployees} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Employee')).toBeInTheDocument()
    expect(screen.getByText('Position')).toBeInTheDocument()
    expect(screen.getByText('Department')).toBeInTheDocument()
    expect(screen.getByText('Salary')).toBeInTheDocument()
  })
})
