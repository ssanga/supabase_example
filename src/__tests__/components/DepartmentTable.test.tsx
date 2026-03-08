import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import DepartmentTable from '../../components/departments/DepartmentTable'
import type { Department } from '../../types'

const mockDepts: Department[] = [
  {
    id: '1',
    name: 'Engineering',
    description: 'Builds stuff',
    location: 'Floor 3',
    budget: 500000,
    created_at: '2024-01-01',
  },
  {
    id: '2',
    name: 'HR',
    description: null,
    location: null,
    budget: null,
    created_at: '2024-01-02',
  },
]

describe('DepartmentTable', () => {
  it('shows empty state when there are no departments', () => {
    render(<DepartmentTable departments={[]} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(/No departments yet/)).toBeInTheDocument()
  })

  it('renders department names in rows', () => {
    render(<DepartmentTable departments={mockDepts} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Engineering')).toBeInTheDocument()
    expect(screen.getByText('HR')).toBeInTheDocument()
  })

  it('renders description and location when present', () => {
    render(<DepartmentTable departments={mockDepts} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Builds stuff')).toBeInTheDocument()
    expect(screen.getByText('Floor 3')).toBeInTheDocument()
  })

  it('formats budget correctly', () => {
    render(<DepartmentTable departments={mockDepts} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('500,000')).toBeInTheDocument()
  })

  it('shows dashes for null description, location and budget', () => {
    render(<DepartmentTable departments={mockDepts} onEdit={vi.fn()} onDelete={vi.fn()} />)
    const dashes = screen.getAllByText('—')
    expect(dashes.length).toBeGreaterThanOrEqual(3)
  })

  it('calls onEdit with the correct department when edit is clicked', () => {
    const onEdit = vi.fn()
    render(<DepartmentTable departments={mockDepts} onEdit={onEdit} onDelete={vi.fn()} />)
    const editButtons = screen.getAllByTitle('Edit')
    fireEvent.click(editButtons[0])
    expect(onEdit).toHaveBeenCalledWith(mockDepts[0])
  })

  it('calls onDelete with the correct department when delete is clicked', () => {
    const onDelete = vi.fn()
    render(<DepartmentTable departments={mockDepts} onEdit={vi.fn()} onDelete={onDelete} />)
    const deleteButtons = screen.getAllByTitle('Delete')
    fireEvent.click(deleteButtons[1])
    expect(onDelete).toHaveBeenCalledWith(mockDepts[1])
  })

  it('renders table headers', () => {
    render(<DepartmentTable departments={mockDepts} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Budget')).toBeInTheDocument()
    expect(screen.getByText('Location')).toBeInTheDocument()
  })
})
