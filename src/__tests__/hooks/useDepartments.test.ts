import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDepartments } from '../../hooks/useDepartments'

vi.mock('../../lib/supabase', () => ({
  supabase: { from: vi.fn() },
}))

import { supabase } from '../../lib/supabase'

const mockFrom = vi.mocked(supabase.from)

const sampleDepts = [
  { id: '1', name: 'Engineering', description: null, location: null, budget: null, created_at: '2024-01-01' },
]

function makeSelectChain(result: { data: unknown; error: unknown }) {
  const order = vi.fn().mockResolvedValue(result)
  const select = vi.fn().mockReturnValue({ order })
  return { select, order }
}

describe('useDepartments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches departments on mount and sets loading correctly', async () => {
    const chain = makeSelectChain({ data: sampleDepts, error: null })
    mockFrom.mockReturnValue({ select: chain.select } as ReturnType<typeof mockFrom>)

    const { result } = renderHook(() => useDepartments())
    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.departments).toEqual(sampleDepts)
    expect(result.current.error).toBeNull()
  })

  it('sets error state when fetch fails', async () => {
    const chain = makeSelectChain({ data: null, error: { message: 'DB error' } })
    mockFrom.mockReturnValue({ select: chain.select } as ReturnType<typeof mockFrom>)

    const { result } = renderHook(() => useDepartments())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('DB error')
    expect(result.current.departments).toEqual([])
  })

  it('create calls insert and refetches', async () => {
    const chain = makeSelectChain({ data: sampleDepts, error: null })
    const insert = vi.fn().mockResolvedValue({ error: null })
    mockFrom.mockReturnValue({ select: chain.select, insert } as ReturnType<typeof mockFrom>)

    const { result } = renderHook(() => useDepartments())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.create({ name: 'New', description: null, location: null, budget: null })
    })

    expect(insert).toHaveBeenCalledWith({ name: 'New', description: null, location: null, budget: null })
    expect(chain.order).toHaveBeenCalledTimes(2)
  })

  it('create throws when insert returns an error', async () => {
    const chain = makeSelectChain({ data: [], error: null })
    const insert = vi.fn().mockResolvedValue({ error: { message: 'Insert failed' } })
    mockFrom.mockReturnValue({ select: chain.select, insert } as ReturnType<typeof mockFrom>)

    const { result } = renderHook(() => useDepartments())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await expect(
      result.current.create({ name: 'X', description: null, location: null, budget: null })
    ).rejects.toThrow('Insert failed')
  })

  it('update calls .update().eq() and refetches', async () => {
    const chain = makeSelectChain({ data: [], error: null })
    const eq = vi.fn().mockResolvedValue({ error: null })
    const update = vi.fn().mockReturnValue({ eq })
    mockFrom.mockReturnValue({ select: chain.select, update } as ReturnType<typeof mockFrom>)

    const { result } = renderHook(() => useDepartments())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.update('1', { name: 'Updated', description: null, location: null, budget: null })
    })

    expect(update).toHaveBeenCalledWith({ name: 'Updated', description: null, location: null, budget: null })
    expect(eq).toHaveBeenCalledWith('id', '1')
  })

  it('update throws when .eq() returns an error', async () => {
    const chain = makeSelectChain({ data: [], error: null })
    const eq = vi.fn().mockResolvedValue({ error: { message: 'Update failed' } })
    const update = vi.fn().mockReturnValue({ eq })
    mockFrom.mockReturnValue({ select: chain.select, update } as ReturnType<typeof mockFrom>)

    const { result } = renderHook(() => useDepartments())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await expect(
      result.current.update('1', { name: 'X', description: null, location: null, budget: null })
    ).rejects.toThrow('Update failed')
  })

  it('remove calls .delete().eq() and refetches', async () => {
    const chain = makeSelectChain({ data: [], error: null })
    const eq = vi.fn().mockResolvedValue({ error: null })
    const del = vi.fn().mockReturnValue({ eq })
    mockFrom.mockReturnValue({ select: chain.select, delete: del } as ReturnType<typeof mockFrom>)

    const { result } = renderHook(() => useDepartments())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.remove('1')
    })

    expect(del).toHaveBeenCalled()
    expect(eq).toHaveBeenCalledWith('id', '1')
  })

  it('remove throws when .eq() returns an error', async () => {
    const chain = makeSelectChain({ data: [], error: null })
    const eq = vi.fn().mockResolvedValue({ error: { message: 'Delete failed' } })
    const del = vi.fn().mockReturnValue({ eq })
    mockFrom.mockReturnValue({ select: chain.select, delete: del } as ReturnType<typeof mockFrom>)

    const { result } = renderHook(() => useDepartments())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await expect(result.current.remove('1')).rejects.toThrow('Delete failed')
  })
})
