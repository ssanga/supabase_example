import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Layout from '../../components/Layout'

function renderLayout(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Layout />
    </MemoryRouter>
  )
}

describe('Layout', () => {
  it('renders the app title', () => {
    renderLayout()
    expect(screen.getByText('People Hub')).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    renderLayout()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Departments')).toBeInTheDocument()
    expect(screen.getByText('Employees')).toBeInTheDocument()
  })

  it('Dashboard link is active on root path', () => {
    renderLayout('/')
    const dashboardLink = screen.getByText('Dashboard').closest('a')
    expect(dashboardLink).toHaveClass('bg-blue-50')
  })

  it('Departments link is active on /departments path', () => {
    renderLayout('/departments')
    const deptLink = screen.getByText('Departments').closest('a')
    expect(deptLink).toHaveClass('bg-blue-50')
  })

  it('renders the Powered by Supabase footer text', () => {
    renderLayout()
    expect(screen.getByText('Powered by Supabase')).toBeInTheDocument()
  })

  it('renders a build date in the footer', () => {
    renderLayout()
    expect(screen.getByTitle('Build timestamp')).toBeInTheDocument()
  })
})
