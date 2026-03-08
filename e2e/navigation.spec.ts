import { test, expect } from '@playwright/test'

test.describe('Sidebar navigation', () => {
  test('Dashboard page loads with heading and subtitle', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
    await expect(page.getByText('Overview of your organization')).toBeVisible()
  })

  test('navigates to Departments page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Departments' }).click()
    await expect(page).toHaveURL('/departments')
    await expect(page.getByRole('heading', { name: 'Departments' })).toBeVisible()
  })

  test('navigates to Employees page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Employees' }).click()
    await expect(page).toHaveURL('/employees')
    await expect(page.getByRole('heading', { name: 'Employees' })).toBeVisible()
  })

  test('navigates back to Dashboard from Departments', async ({ page }) => {
    await page.goto('/departments')
    await page.getByRole('link', { name: 'Dashboard' }).click()
    await expect(page).toHaveURL('/')
    await expect(page.getByText('Overview of your organization')).toBeVisible()
  })

  test('People Hub title and Supabase footer are visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('People Hub')).toBeVisible()
    await expect(page.getByText('Powered by Supabase')).toBeVisible()
  })
})
