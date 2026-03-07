import { useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { useDepartments } from '../hooks/useDepartments'
import DepartmentTable from '../components/departments/DepartmentTable'
import DepartmentForm from '../components/departments/DepartmentForm'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import type { Department, DepartmentFormData } from '../types'

export default function Departments() {
  const { departments, loading, error, create, update, remove, refetch } = useDepartments()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Department | null>(null)
  const [deleting, setDeleting] = useState<Department | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const openCreate = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (dept: Department) => { setEditing(dept); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditing(null) }

  const handleSubmit = async (data: DepartmentFormData) => {
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

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Departments</h2>
          <p className="text-sm text-gray-500 mt-0.5">{departments.length} department{departments.length !== 1 ? 's' : ''}</p>
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
            <Plus size={16} /> Add department
          </button>
        </div>
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
        <DepartmentTable
          departments={departments}
          onEdit={openEdit}
          onDelete={setDeleting}
        />
      )}

      <Modal
        open={modalOpen}
        title={editing ? 'Edit department' : 'New department'}
        onClose={closeModal}
      >
        <DepartmentForm
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        message={`Delete "${deleting?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={deleteLoading}
      />
    </div>
  )
}
