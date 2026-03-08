import { test, expect } from '@playwright/test'
import { cleanQADepartments } from './helpers/cleanup'

const QA_NAME = 'QA Automation Dept'
const QA_NAME_EDITED = 'QA Automation Dept Edited'

test.describe('Departments CRUD', () => {
  test.afterAll(async ({ request }) => {
    await cleanQADepartments(request)
  })

  test('page loads and shows the Departments heading', async ({ page }) => {
    await page.goto('/departments')
    await expect(page.getByRole('heading', { name: 'Departments' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Add department' })).toBeVisible()
  })

  test('create a QA department', async ({ page }) => {
    await page.goto('/departments')
    await page.getByRole('button', { name: 'Add department' }).click()

    // Modal opens
    await expect(page.getByText('New department')).toBeVisible()

    await page.getByPlaceholder('Engineering').fill(QA_NAME)
    await page.getByPlaceholder('What does this department do?').fill('QA automated testing department')
    await page.getByPlaceholder('Floor 3 — Building A').fill('QA Lab')
    await page.getByRole('button', { name: 'Create department' }).click()

    // Modal closes and row appears
    await expect(page.getByText('New department')).not.toBeVisible()
    await expect(page.getByRole('cell', { name: QA_NAME })).toBeVisible()
  })

  test('department row shows description and location', async ({ page }) => {
    await page.goto('/departments')
    await expect(page.getByText('QA automated testing department')).toBeVisible()
    await expect(page.getByText('QA Lab')).toBeVisible()
  })

  test('validation prevents submitting an empty name', async ({ page }) => {
    await page.goto('/departments')
    await page.getByRole('button', { name: 'Add department' }).click()
    await page.getByRole('button', { name: 'Create department' }).click()
    await expect(page.getByText('Name is required')).toBeVisible()

    // Close without creating
    await page.keyboard.press('Escape')
    await expect(page.getByText('Name is required')).not.toBeVisible()
  })

  test('edit the QA department', async ({ page }) => {
    await page.goto('/departments')

    const row = page.getByRole('row').filter({ hasText: QA_NAME })
    await row.getByTitle('Edit').click()

    await expect(page.getByText('Edit department')).toBeVisible()
    // Pre-filled with existing name
    const nameInput = page.locator('input[placeholder="Engineering"]')
    await expect(nameInput).toHaveValue(QA_NAME)

    await nameInput.fill(QA_NAME_EDITED)
    await page.getByRole('button', { name: 'Save changes' }).click()

    await expect(page.getByText('Edit department')).not.toBeVisible()
    await expect(page.getByRole('cell', { name: QA_NAME_EDITED })).toBeVisible()
  })

  test('cancel closes the modal without saving', async ({ page }) => {
    await page.goto('/departments')
    await page.getByRole('button', { name: 'Add department' }).click()
    await page.getByPlaceholder('Engineering').fill('QA Should Not Be Saved')
    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page.getByText('QA Should Not Be Saved')).not.toBeVisible()
  })

  test('delete the QA department', async ({ page }) => {
    await page.goto('/departments')

    const row = page.getByRole('row').filter({ hasText: QA_NAME_EDITED })
    await row.getByTitle('Delete').click()

    // Confirm dialog appears
    await expect(page.getByText('Confirm delete')).toBeVisible()
    await expect(page.getByText(`Delete "${QA_NAME_EDITED}"?`)).toBeVisible()

    // bg-red-500 is unique to the ConfirmDialog confirm button (table buttons use hover:bg-red-50)
    await page.locator('button.bg-red-500').click()

    await expect(page.getByText('Confirm delete')).not.toBeVisible()
    await expect(page.getByRole('cell', { name: QA_NAME_EDITED })).not.toBeVisible()
  })

  test('cancel on confirm dialog keeps the department', async ({ page }) => {
    // Create a temporary QA dept just for this test
    await page.goto('/departments')
    await page.getByRole('button', { name: 'Add department' }).click()
    await page.getByPlaceholder('Engineering').fill('QA Cancel Test')
    await page.getByRole('button', { name: 'Create department' }).click()
    await expect(page.getByRole('cell', { name: 'QA Cancel Test' })).toBeVisible()

    // Click delete then cancel
    const row = page.getByRole('row').filter({ hasText: 'QA Cancel Test' })
    await row.getByTitle('Delete').click()
    await expect(page.getByText('Confirm delete')).toBeVisible()
    await page.getByRole('button', { name: 'Cancel' }).click()

    // Department still there
    await expect(page.getByRole('cell', { name: 'QA Cancel Test' })).toBeVisible()
    // afterAll will clean it up
  })
})
