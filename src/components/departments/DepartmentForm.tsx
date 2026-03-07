import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Department, DepartmentFormData } from '../../types'

interface DepartmentFormProps {
  initial?: Department | null
  onSubmit: (data: DepartmentFormData) => Promise<void>
  onCancel: () => void
}

export default function DepartmentForm({ initial, onSubmit, onCancel }: DepartmentFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<DepartmentFormData>({
    defaultValues: {
      name:        initial?.name        ?? '',
      description: initial?.description ?? '',
      location:    initial?.location    ?? '',
      budget:      initial?.budget      ?? undefined,
    },
  })

  useEffect(() => {
    reset({
      name:        initial?.name        ?? '',
      description: initial?.description ?? '',
      location:    initial?.location    ?? '',
      budget:      initial?.budget      ?? undefined,
    })
  }, [initial, reset])

  const submit = async (data: DepartmentFormData) => {
    setSubmitting(true)
    setApiError(null)
    try {
      await onSubmit(data)
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

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
        <input
          {...register('name', { required: 'Name is required' })}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Engineering"
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
        <textarea
          {...register('description')}
          rows={2}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="What does this department do?"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
          <input
            {...register('location')}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Floor 3 — Building A"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Budget ($)</label>
          <input
            type="number"
            min={0}
            step={1000}
            {...register('budget', { valueAsNumber: true })}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="500000"
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
          {submitting ? 'Saving…' : initial ? 'Save changes' : 'Create department'}
        </button>
      </div>
    </form>
  )
}
