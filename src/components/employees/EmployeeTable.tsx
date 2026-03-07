import { Pencil, Trash2 } from 'lucide-react'
import type { Employee } from '../../types'

interface EmployeeTableProps {
  employees: Employee[]
  onEdit: (emp: Employee) => void
  onDelete: (emp: Employee) => void
}

function formatSalary(value: number | null) {
  if (value == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

function formatDate(value: string | null) {
  if (!value) return '—'
  return new Date(value + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function initials(emp: Employee) {
  return `${emp.first_name[0]}${emp.last_name[0]}`.toUpperCase()
}

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-green-100 text-green-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-teal-100 text-teal-700',
]

function avatarColor(name: string) {
  let hash = 0
  for (const c of name) hash += c.charCodeAt(0)
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

export default function EmployeeTable({ employees, onEdit, onDelete }: EmployeeTableProps) {
  if (employees.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-sm">No employees yet. Add one to get started.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Employee</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Position</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Department</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Hire date</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Salary</th>
            <th className="px-4 py-3 w-20"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {employees.map((emp) => {
            const fullName = `${emp.first_name} ${emp.last_name}`
            const color = avatarColor(fullName)
            return (
              <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${color}`}>
                      {initials(emp)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{fullName}</p>
                      <p className="text-xs text-gray-400">{emp.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{emp.position}</td>
                <td className="px-4 py-3">
                  {emp.department
                    ? <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md">{emp.department.name}</span>
                    : <span className="text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDate(emp.hire_date)}</td>
                <td className="px-4 py-3 text-right text-gray-700">{formatSalary(emp.salary)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(emp)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(emp)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
