import { Pencil, Trash2, MapPin, DollarSign } from 'lucide-react'
import type { Department } from '../../types'

interface DepartmentTableProps {
  departments: Department[]
  onEdit: (dept: Department) => void
  onDelete: (dept: Department) => void
}

function formatBudget(value: number | null) {
  if (value == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

export default function DepartmentTable({ departments, onEdit, onDelete }: DepartmentTableProps) {
  if (departments.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-sm">No departments yet. Create one to get started.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Name</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Description</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Location</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Budget</th>
            <th className="px-4 py-3 w-20"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {departments.map((dept) => (
            <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900">{dept.name}</td>
              <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{dept.description ?? '—'}</td>
              <td className="px-4 py-3">
                {dept.location
                  ? <span className="inline-flex items-center gap-1 text-gray-500"><MapPin size={12} />{dept.location}</span>
                  : <span className="text-gray-400">—</span>}
              </td>
              <td className="px-4 py-3 text-right">
                {dept.budget != null
                  ? <span className="inline-flex items-center gap-1 text-gray-700"><DollarSign size={12} className="text-green-500" />{formatBudget(dept.budget).replace('$', '')}</span>
                  : <span className="text-gray-400">—</span>}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(dept)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(dept)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
