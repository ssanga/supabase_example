import { useState } from 'react'
import { Plus, RefreshCw, Search } from 'lucide-react'
import { useEmployees } from '../hooks/useEmployees'
import { useDepartments } from '../hooks/useDepartments'
import EmployeeTable from '../components/employees/EmployeeTable'
import EmployeeForm from '../components/employees/EmployeeForm'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import type { Employee, EmployeeFormData } from '../types'

export default function Employees() {
  const { employees, loading, error, create, update, remove, refetch } = useEmployees()
  const { departments } = useDepartments()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Employee | null>(null)
  const [deleting, setDeleting] = useState<Employee | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('')

  const openCreate = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (emp: Employee) => { setEditing(emp); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditing(null) }

  const handleSubmit = async (data: EmployeeFormData) => {
    if (editing) await update(editing.id, data)
    else await create(data)
    closeModal()
  }

  const handleDelete = async () => {
    if (!deleting) return
    setDeleteLoading(true)
    try { await remove(deleting.id) }
    finally { setDeleteLoading(false); setDeleting(null) }
  }

  const filtered = employees.filter(emp => {
    const matchSearch = search === '' || [emp.first_name, emp.last_name, emp.email, emp.position]
      .join(' ').toLowerCase().includes(search.toLowerCase())
    const matchDept = deptFilter === '' || emp.department_id === deptFilter
    return matchSearch && matchDept
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Employees</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered.length}{filtered.length !== employees.length ? ` of ${employees.length}` : ''} employee{employees.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refetch}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            <Plus size={16} /> Add employee
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search employees…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          className="border border-gray-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
        >
          <option value="">All departments</option>
          {departments.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <RefreshCw size={20} className="animate-spin mr-2" />
          <span className="text-sm">Loading…</span>
        </div>
      ) : (
        <EmployeeTable
          employees={filtered}
          onEdit={openEdit}
          onDelete={setDeleting}
        />
      )}

      <Modal
        open={modalOpen}
        title={editing ? 'Edit employee' : 'New employee'}
        onClose={closeModal}
      >
        <EmployeeForm
          initial={editing}
          departments={departments}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        message={`Delete ${deleting?.first_name} ${deleting?.last_name}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={deleteLoading}
      />
    </div>
  )
}
