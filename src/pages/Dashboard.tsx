import { Users, Building2, DollarSign, TrendingUp } from 'lucide-react'
import { useEmployees } from '../hooks/useEmployees'
import { useDepartments } from '../hooks/useDepartments'

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType
  label: string
  value: string | number
  color: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={16} />
        </div>
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const { employees } = useEmployees()
  const { departments } = useDepartments()

  const totalSalary = employees.reduce((sum, e) => sum + (e.salary ?? 0), 0)
  const avgSalary = employees.length ? totalSalary / employees.length : 0

  const fmt = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

  const recentEmployees = [...employees]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  return (
    <div className="p-8">
      <div className="mb-7">
        <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-0.5">Overview of your organization</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users}      label="Total employees"  value={employees.length}  color="bg-blue-50 text-blue-600" />
        <StatCard icon={Building2}  label="Departments"      value={departments.length} color="bg-purple-50 text-purple-600" />
        <StatCard icon={DollarSign} label="Total payroll"    value={fmt(totalSalary)}  color="bg-green-50 text-green-600" />
        <StatCard icon={TrendingUp} label="Avg salary"       value={fmt(avgSalary)}    color="bg-amber-50 text-amber-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Employees by department */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Employees by department</h3>
          <div className="space-y-3">
            {departments.map(dept => {
              const count = employees.filter(e => e.department_id === dept.id).length
              const pct = employees.length ? (count / employees.length) * 100 : 0
              return (
                <div key={dept.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{dept.name}</span>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent employees */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Recently added</h3>
          <div className="space-y-3">
            {recentEmployees.map(emp => (
              <div key={emp.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{emp.first_name} {emp.last_name}</p>
                  <p className="text-xs text-gray-400">{emp.position}</p>
                </div>
                {emp.department && (
                  <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                    {emp.department.name}
                  </span>
                )}
              </div>
            ))}
            {recentEmployees.length === 0 && (
              <p className="text-sm text-gray-400">No employees yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
