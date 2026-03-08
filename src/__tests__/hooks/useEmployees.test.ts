import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useEmployees } from '../../hooks/useEmployees'

vi.mock('../../lib/supabase', () => ({
  supabase: { from: vi.fn() },
}))

import { supabase } from '../../lib/supabase'

const mockFrom = vi.mocked(supabase.from)

const sampleEmployees = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone: null,
    position: 'Dev',
    hire_date: null,
    salary: 80000,
    department_id: 'd1',
    created_at: '2024-01-01',
    department: { id: 'd1', name: 'Eng', description: null, location: null, budget: null, created_at: '2024-01-01' },
  },
]

function makeSelectChain(result: { data: unknown; error: unknown }) {
  const order = vi.fn().mockResolvedValue(result)
  const select = vi.fn().mockReturnValue({ order })
  return { select, order }
}

describe('useEmployees', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches employees on mount and sets loading correctly', async () => {
    const chain = makeSelectChain({ data: sampleEmployees, error: null })
    mockFrom.mockReturnValue({ select: chain.select } as ReturnType<typeof mockFrom>)

    const { result } = renderHook(() => useEmployees())
    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.employees).toEqual(sampleEmployees)
    expect(result.current.error).toBeNull()
  })

  it('sets error state when fetch fails', async () => {
    const chain = makeSelectChain({ data: null, error: { message: 'Connection error' } })
    mockFrom.mockReturnValue({ select: chain.select } as ReturnType<typeof mockFrom>)

    const { result } = renderHook(() => useEmployees())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Connection error')
    expect(result.current.employees).toEqual([])
  })

  it('create calls insert and refetches', async () => {
    const chain = makeSelectChain({ data: sampleEmployees, error: null })
    const insert = vi.fn().mockResolvedValue({ error: null })
    mockFrom.mockReturnValue({ select: chain.select, insert } as ReturnType<typeof mockFrom>)

    const { result } = renderHook(() => useEmployees())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.create({
        first_name: 'Jane', last_name: 'Smith', email: 'jane@test.com',
        phone: null, position: 'PM', hire_date: null, salary: null, department_id: null,
      })
    })

    expect(insert).toHaveBeenCalled()
    expect(chain.order).toHaveBeenCalledTimes(2)
  })

  it('create throws when insert returns an error', async () => {
    const chain = makeSelectChain({ data: [], error: null })
    const insert = vi.fn().mockResolvedValue({ error: { message: 'Duplicate email' } })
    mockFrom.mockReturnValue({ select: chain.select, insert } as ReturnType<typeof mockFrom>)

    const { result } = renderHook(() => useEmployees())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await expect(
      result.current.create({
        first_name: 'Jane', last_name: 'Smith', email: 'dupe@test.com',
        phone: null, position: 'PM', hire_date: null, salary: null, department_id: null,
      })
    ).rejects.toThrow('Duplicate email')
  })

  it('update calls .update().eq() and refetches', async () => {
    const chain = makeSelectChain({ data: [], error: null })
    const eq = vi.fn().mockResolvedValue({ error: null })
    const update = vi.fn().mockReturnValue({ eq })
    mockFrom.mockReturnValue({ select: chain.select, update } as ReturnType<typeof mockFrom>)

    const { result } = renderHook(() => useEmployees())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.update('1', {
        first_name: 'Updated', last_name: 'Name', email: 'u@test.com',
        phone: null, position: 'Dev', hire_date: null, salary: null, department_id: null,
      })
    })

    expect(eq).toHaveBeenCalledWith('id', '1')
  })

  it('remove calls .delete().eq() and refetches', async () => {
    const chain = makeSelectChain({ data: [], error: null })
    const eq = vi.fn().mockResolvedValue({ error: null })
    const del = vi.fn().mockReturnValue({ eq })
    mockFrom.mockReturnValue({ select: chain.select, delete: del } as ReturnType<typeof mockFrom>)

    const { result } = renderHook(() => useEmployees())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.remove('1')
    })

    expect(del).toHaveBeenCalled()
    expect(eq).toHaveBeenCalledWith('id', '1')
  })
})
