export interface Department {
  id: string
  name: string
  description: string | null
  location: string | null
  budget: number | null
  created_at: string
}

export interface Employee {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  position: string
  hire_date: string | null
  salary: number | null
  department_id: string | null
  created_at: string
  department?: Department | null
}

export type DepartmentFormData = Omit<Department, 'id' | 'created_at'>
export type EmployeeFormData = Omit<Employee, 'id' | 'created_at' | 'department'>
