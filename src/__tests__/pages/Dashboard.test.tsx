import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard'
import type { Department, Employee } from '../../types'

vi.mock('../../hooks/useEmployees')
vi.mock('../../hooks/useDepartments')

import { useEmployees } from '../../hooks/useEmployees'
import { useDepartments } from '../../hooks/useDepartments'

const mockUseEmployees = vi.mocked(useEmployees)
const mockUseDepartments = vi.mocked(useDepartments)

const noEmployees = { employees: [] as Employee[], loading: false, error: null, create: vi.fn(), update: vi.fn(), remove: vi.fn(), refetch: vi.fn() }
const noDepartments = { departments: [] as Department[], loading: false, error: null, create: vi.fn(), update: vi.fn(), remove: vi.fn(), refetch: vi.fn() }

function renderDashboard() {
  return render(<MemoryRouter><Dashboard /></MemoryRouter>)
}

describe('Dashboard', () => {
  beforeEach(() => {
    mockUseEmployees.mockReturnValue(noEmployees)
    mockUseDepartments.mockReturnValue(noDepartments)
  })

  it('renders the Dashboard heading', () => {
    renderDashboard()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Overview of your organization')).toBeInTheDocument()
  })

  it('shows zero employee count by default', () => {
    renderDashboard()
    expect(screen.getByText('Total employees')).toBeInTheDocument()
    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBeGreaterThanOrEqual(1)
  })

  it('shows No employees yet message in recent employees section', () => {
    renderDashboard()
    expect(screen.getByText('No employees yet.')).toBeInTheDocument()
  })

  it('computes and displays total salary', () => {
    mockUseEmployees.mockReturnValue({
      ...noEmployees,
      employees: [
        { id: '1', first_name: 'John', last_name: 'Doe', email: 'j@test.com', phone: null, position: 'Dev', hire_date: null, salary: 100000, department_id: null, created_at: '2024-01-01' },
        { id: '2', first_name: 'Jane', last_name: 'Smith', email: 's@test.com', phone: null, position: 'PM', hire_date: null, salary: 80000, department_id: null, created_at: '2024-01-02' },
      ],
    })
    renderDashboard()
    expect(screen.getByText('$180,000')).toBeInTheDocument()
  })

  it('computes and displays average salary', () => {
    mockUseEmployees.mockReturnValue({
      ...noEmployees,
      employees: [
        { id: '1', first_name: 'Alice', last_name: 'A', email: 'a@test.com', phone: null, position: 'Dev', hire_date: null, salary: 100000, department_id: null, created_at: '2024-01-01' },
        { id: '2', first_name: 'Bob', last_name: 'B', email: 'b@test.com', phone: null, position: 'QA', hire_date: null, salary: 60000, department_id: null, created_at: '2024-01-02' },
      ],
    })
    renderDashboard()
    expect(screen.getByText('$80,000')).toBeInTheDocument()
  })

  it('handles employees with null salary in total', () => {
    mockUseEmployees.mockReturnValue({
      ...noEmployees,
      employees: [
        { id: '1', first_name: 'Alice', last_name: 'A', email: 'a@test.com', phone: null, position: 'Dev', hire_date: null, salary: null, department_id: null, created_at: '2024-01-01' },
      ],
    })
    renderDashboard()
    expect(screen.getByText('Total payroll')).toBeInTheDocument()
  })

  it('renders departments in employees-by-department section', () => {
    mockUseDepartments.mockReturnValue({
      ...noDepartments,
      departments: [
        { id: 'd1', name: 'Engineering', description: null, location: null, budget: null, created_at: '2024-01-01' },
        { id: 'd2', name: 'Marketing', description: null, location: null, budget: null, created_at: '2024-01-02' },
      ],
    })
    renderDashboard()
    expect(screen.getByText('Engineering')).toBeInTheDocument()
    expect(screen.getByText('Marketing')).toBeInTheDocument()
  })

  it('renders recent employees sorted by created_at descending', () => {
    mockUseEmployees.mockReturnValue({
      ...noEmployees,
      employees: [
        { id: '1', first_name: 'Alice', last_name: 'First', email: 'a@test.com', phone: null, position: 'Dev', hire_date: null, salary: null, department_id: null, created_at: '2024-01-01' },
        { id: '2', first_name: 'Bob', last_name: 'Latest', email: 'b@test.com', phone: null, position: 'PM', hire_date: null, salary: null, department_id: null, created_at: '2024-06-01' },
      ],
    })
    renderDashboard()
    const names = screen.getAllByText(/First|Latest/)
    expect(names[0]).toHaveTextContent('Bob Latest')
  })

  it('shows department count stat', () => {
    mockUseDepartments.mockReturnValue({
      ...noDepartments,
      departments: [
        { id: 'd1', name: 'Eng', description: null, location: null, budget: null, created_at: '2024-01-01' },
        { id: 'd2', name: 'HR', description: null, location: null, budget: null, created_at: '2024-01-02' },
      ],
    })
    renderDashboard()
    expect(screen.getByText('Departments')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})
