import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Department, DepartmentFormData } from '../types'

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name')
    if (error) setError(error.message)
    else setDepartments(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const create = async (values: DepartmentFormData) => {
    const { error } = await supabase.from('departments').insert(values)
    if (error) throw new Error(error.message)
    await fetch()
  }

  const update = async (id: string, values: DepartmentFormData) => {
    const { error } = await supabase.from('departments').update(values).eq('id', id)
    if (error) throw new Error(error.message)
    await fetch()
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from('departments').delete().eq('id', id)
    if (error) throw new Error(error.message)
    await fetch()
  }

  return { departments, loading, error, create, update, remove, refetch: fetch }
}
