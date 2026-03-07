import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Employee, EmployeeFormData } from '../types'

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('employees')
      .select('*, department:departments(id, name, location, description, budget, created_at)')
      .order('last_name')
    if (error) setError(error.message)
    else setEmployees(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const create = async (values: EmployeeFormData) => {
    const { error } = await supabase.from('employees').insert(values)
    if (error) throw new Error(error.message)
    await fetch()
  }

  const update = async (id: string, values: EmployeeFormData) => {
    const { error } = await supabase.from('employees').update(values).eq('id', id)
    if (error) throw new Error(error.message)
    await fetch()
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from('employees').delete().eq('id', id)
    if (error) throw new Error(error.message)
    await fetch()
  }

  return { employees, loading, error, create, update, remove, refetch: fetch }
}
