import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Department, Employee, EmployeeFormData } from '../../types'

interface EmployeeFormProps {
  initial?: Employee | null
  departments: Department[]
  onSubmit: (data: EmployeeFormData) => Promise<void>
  onCancel: () => void
}

export default function EmployeeForm({ initial, departments, onSubmit, onCancel }: EmployeeFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EmployeeFormData>({
    defaultValues: {
      first_name:    initial?.first_name    ?? '',
      last_name:     initial?.last_name     ?? '',
      email:         initial?.email         ?? '',
      phone:         initial?.phone         ?? '',
      position:      initial?.position      ?? '',
      hire_date:     initial?.hire_date     ?? '',
      salary:        initial?.salary        ?? undefined,
      department_id: initial?.department_id ?? '',
    },
  })

  useEffect(() => {
    reset({
      first_name:    initial?.first_name    ?? '',
      last_name:     initial?.last_name     ?? '',
      email:         initial?.email         ?? '',
      phone:         initial?.phone         ?? '',
      position:      initial?.position      ?? '',
      hire_date:     initial?.hire_date     ?? '',
      salary:        initial?.salary        ?? undefined,
      department_id: initial?.department_id ?? '',
    })
  }, [initial, reset])

  const submit = async (data: EmployeeFormData) => {
    setSubmitting(true)
    setApiError(null)
    try {
      const payload = {
        ...data,
        department_id: data.department_id || null,
        hire_date:     data.hire_date     || null,
        salary:        data.salary        || null,
        phone:         data.phone         || null,
      }
      await onSubmit(payload)
    } catch (e: unknown) {
      setApiError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {apiError && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{apiError}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">First name *</label>
          <input
            {...register('first_name', { required: 'Required' })}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.first_name && <p className="text-xs text-red-500 mt-1">{errors.first_name.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Last name *</label>
          <input
            {...register('last_name', { required: 'Required' })}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.last_name && <p className="text-xs text-red-500 mt-1">{errors.last_name.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
        <input
          type="email"
          {...register('email', { required: 'Required' })}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
          <input
            {...register('phone')}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+1-555-0100"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Hire date</label>
          <input
            type="date"
            {...register('hire_date')}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Position *</label>
        <input
          {...register('position', { required: 'Required' })}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Software Engineer"
        />
        {errors.position && <p className="text-xs text-red-500 mt-1">{errors.position.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
          <select
            {...register('department_id')}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">— No department —</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Salary ($)</label>
          <input
            type="number"
            min={0}
            step={1000}
            {...register('salary', { valueAsNumber: true })}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="75000"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
        >
          {submitting ? 'Saving…' : initial ? 'Save changes' : 'Add employee'}
        </button>
      </div>
    </form>
  )
}
