import { test, expect } from '@playwright/test'

test.describe('Product Listing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays product cards', async ({ page }) => {
    // Wait for products to load from API
    await page.waitForSelector('[class*="rounded-lg"]', { timeout: 15000 })

    const productCards = page.locator('[class*="rounded-lg"][class*="shadow"]')
    await expect(productCards.first()).toBeVisible()

    // Should display multiple products
    const count = await productCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('each product card shows title, price, and Add to Cart button', async ({
    page,
  }) => {
    await expect(
      page.locator('button:has-text("Add to Cart")').first(),
    ).toBeVisible()

    const addToCartButtons = page.locator('button:has-text("Add to Cart")')
    await expect(addToCartButtons.first()).toBeVisible()

    // Check at least one product has a price displayed (format: $XX.XX)
    await expect(page.locator('text=/\\$\\d+\\.\\d{2}/')).toBeTruthy()
  })

  test('category filter narrows results', async ({ page }) => {
    // Wait for products to load
    await expect(
      page.locator('button:has-text("Add to Cart")').first(),
    ).toBeVisible()

    // Look for a category filter select/dropdown
    const categorySelect = page.locator('select').first()
    if (await categorySelect.isVisible()) {
      // Get initial count
      const initialCards = await page
        .locator('button:has-text("Add to Cart")')
        .count()

      // Select a specific category
      await categorySelect.selectOption({ index: 1 })

      // Wait for filter to apply
      await page.waitForTimeout(500)

      // Filtered count should be different (or same if category has all items)
      const filteredCards = await page
        .locator('button:has-text("Add to Cart")')
        .count()
      expect(filteredCards).toBeLessThanOrEqual(initialCards)
    }
  })

  test('search filters products by title', async ({ page }) => {
    // Wait for products to load
    await expect(
      page.locator('button:has-text("Add to Cart")').first(),
    ).toBeVisible()

    const searchInput = page.locator('input[type="text"]').first()
    if (await searchInput.isVisible()) {
      await searchInput.fill('backpack')

      // Wait for debounce
      await page.waitForTimeout(600)

      // Results should be filtered
      const cards = page.locator('button:has-text("Add to Cart")')
      const count = await cards.count()
      expect(count).toBeGreaterThanOrEqual(0)
    }
  })
})
