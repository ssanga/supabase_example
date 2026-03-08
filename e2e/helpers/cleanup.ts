import type { APIRequestContext } from '@playwright/test'
import { config } from 'dotenv'

config()

const BASE = process.env.VITE_SUPABASE_URL
const KEY = process.env.VITE_SUPABASE_ANON_KEY

function headers() {
  return {
    apikey: KEY!,
    Authorization: `Bearer ${KEY!}`,
    'Content-Type': 'application/json',
    Prefer: 'return=minimal',
  }
}

/**
 * Deletes all departments whose name starts with "QA" (case-insensitive).
 * Uses PostgREST ilike filter — * is the wildcard character.
 */
export async function cleanQADepartments(request: APIRequestContext) {
  if (!BASE || !KEY) throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
  await request.delete(`${BASE}/rest/v1/departments?name=ilike.QA*`, { headers: headers() })
}

/**
 * Deletes all employees whose email starts with "qa.playwright".
 */
export async function cleanQAEmployees(request: APIRequestContext) {
  if (!BASE || !KEY) throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
  await request.delete(`${BASE}/rest/v1/employees?email=ilike.qa.playwright*`, { headers: headers() })
}
