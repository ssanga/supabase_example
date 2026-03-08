import { test, expect } from '@playwright/test'
import { cleanQAEmployees } from './helpers/cleanup'

const QA_EMAIL = 'qa.playwright@test.com'
const QA_FIRST = 'QA'
const QA_LAST = 'Playwright'
const QA_POSITION = 'QA Engineer'
const QA_POSITION_EDITED = 'QA Lead Engineer'

test.describe('Employees CRUD', () => {
  test.afterAll(async ({ request }) => {
    await cleanQAEmployees(request)
  })

  test('page loads and shows the Employees heading', async ({ page }) => {
    await page.goto('/employees')
    await expect(page.getByRole('heading', { name: 'Employees' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Add employee' })).toBeVisible()
    await expect(page.getByPlaceholder('Search employees…')).toBeVisible()
  })

  test('create a QA employee', async ({ page }) => {
    await page.goto('/employees')
    await page.getByRole('button', { name: 'Add employee' }).click()

    await expect(page.getByText('New employee')).toBeVisible()

    await page.locator('input[name="first_name"]').fill(QA_FIRST)
    await page.locator('input[name="last_name"]').fill(QA_LAST)
    await page.locator('input[name="email"]').fill(QA_EMAIL)
    await page.locator('input[name="position"]').fill(QA_POSITION)

    // Use type="submit" to target the form button, not the page-level "Add employee" header button
    await page.locator('button[type="submit"]').click()

    await expect(page.getByText('New employee')).not.toBeVisible()
    await expect(page.getByText(`${QA_FIRST} ${QA_LAST}`)).toBeVisible()
  })

  test('employee row shows email and position', async ({ page }) => {
    await page.goto('/employees')
    await expect(page.getByText(QA_EMAIL)).toBeVisible()
    await expect(page.getByText(QA_POSITION)).toBeVisible()
  })

  test('validation prevents submitting empty required fields', async ({ page }) => {
    await page.goto('/employees')
    await page.getByRole('button', { name: 'Add employee' }).click()
    await page.locator('button[type="submit"]').click()
    await expect(page.getByText('Required').first()).toBeVisible()
    await page.keyboard.press('Escape')
  })

  test('search filters employees by name', async ({ page }) => {
    await page.goto('/employees')
    await page.getByPlaceholder('Search employees…').fill('QA Playwright')
    // Only QA employee should be visible (plus possibly partial matches)
    await expect(page.getByText(`${QA_FIRST} ${QA_LAST}`)).toBeVisible()
    await page.getByPlaceholder('Search employees…').clear()
  })

  test('search filters employees by email', async ({ page }) => {
    await page.goto('/employees')
    await page.getByPlaceholder('Search employees…').fill(QA_EMAIL)
    await expect(page.getByText(`${QA_FIRST} ${QA_LAST}`)).toBeVisible()
    await page.getByPlaceholder('Search employees…').clear()
  })

  test('search with no match shows empty table', async ({ page }) => {
    await page.goto('/employees')
    await page.getByPlaceholder('Search employees…').fill('xyznonexistentxyz123')
    await expect(page.getByText('No employees yet. Add one to get started.')).toBeVisible()
    await page.getByPlaceholder('Search employees…').clear()
  })

  test('edit the QA employee', async ({ page }) => {
    await page.goto('/employees')

    const row = page.getByRole('row').filter({ hasText: QA_EMAIL })
    await row.getByTitle('Edit').click()

    await expect(page.getByText('Edit employee')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toHaveValue(QA_EMAIL)

    await page.locator('input[name="position"]').fill(QA_POSITION_EDITED)
    await page.getByRole('button', { name: 'Save changes' }).click()

    await expect(page.getByText('Edit employee')).not.toBeVisible()
    await expect(page.getByText(QA_POSITION_EDITED)).toBeVisible()
  })

  test('delete the QA employee', async ({ page }) => {
    await page.goto('/employees')

    const row = page.getByRole('row').filter({ hasText: QA_EMAIL })
    await row.getByTitle('Delete').click()

    await expect(page.getByText('Confirm delete')).toBeVisible()
    await expect(page.getByText(`Delete ${QA_FIRST} ${QA_LAST}?`)).toBeVisible()

    // bg-red-500 is unique to the ConfirmDialog confirm button (table buttons use hover:bg-red-50)
    await page.locator('button.bg-red-500').click()

    await expect(page.getByText('Confirm delete')).not.toBeVisible()
    await expect(page.getByText(QA_EMAIL)).not.toBeVisible()
  })
})
