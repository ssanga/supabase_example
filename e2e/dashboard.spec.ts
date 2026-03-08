import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test('shows all stat cards', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Total employees')).toBeVisible()
    await expect(page.locator('main').getByText('Departments')).toBeVisible()
    await expect(page.getByText('Total payroll')).toBeVisible()
    await expect(page.getByText('Avg salary')).toBeVisible()
  })

  test('shows employees-by-department section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Employees by department')).toBeVisible()
  })

  test('shows recently added section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Recently added')).toBeVisible()
  })

  test('stat counts are numeric values', async ({ page }) => {
    await page.goto('/')
    // Employee count and department count should be visible numbers
    const employeeCard = page.locator('.bg-white').filter({ hasText: 'Total employees' })
    const countText = await employeeCard.locator('p.text-2xl').textContent()
    expect(Number(countText)).toBeGreaterThanOrEqual(0)
  })

  test('total payroll is formatted as currency', async ({ page }) => {
    await page.goto('/')
    const payrollCard = page.locator('.bg-white').filter({ hasText: 'Total payroll' })
    const payrollText = await payrollCard.locator('p.text-2xl').textContent()
    // Should be $0 or a formatted dollar amount like $1,234,567
    expect(payrollText).toMatch(/^\$[\d,]+$/)
  })
})
