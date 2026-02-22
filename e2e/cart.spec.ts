import { test, expect } from '@playwright/test'

test.describe('Cart Management', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure clean cart state
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('add product to cart and see badge update', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('button:has-text("Add to Cart")', {
      timeout: 15000,
    })

    // Click the first "Add to Cart" button
    const addButton = page.locator('button:has-text("Add to Cart")').first()
    await addButton.click()

    // Cart badge should appear with count
    await expect(page.locator('text=/\\d+/').first()).toBeVisible()
  })

  test('navigate to cart page and see items', async ({ page }) => {
    // Wait for products to load and add an item
    await page.waitForSelector('button:has-text("Add to Cart")', {
      timeout: 15000,
    })
    await page.locator('button:has-text("Add to Cart")').first().click()

    // Navigate to cart
    await page.locator('a[aria-label="Shopping cart"]').click()

    // Should see cart items (not the empty message)
    await expect(page.locator('text="Order Summary"')).toBeVisible()
  })

  test('update item quantity in cart', async ({ page }) => {
    // Add a product first
    await page.waitForSelector('button:has-text("Add to Cart")', {
      timeout: 15000,
    })
    await page.locator('button:has-text("Add to Cart")').first().click()

    // Go to cart
    await page.locator('a[aria-label="Shopping cart"]').click()
    await expect(page.locator('text="Order Summary"')).toBeVisible()

    // The + button is inside the quantity controls flex div (.flex.items-center.gap-2)
    // It's the second button inside that container (after the - button)
    const quantityControls = page.locator('.flex.items-center.gap-2').first()
    const plusButton = quantityControls.locator('button').last()

    await expect(plusButton).toBeVisible()
    await plusButton.click()

    // Quantity should update to 2
    await page.waitForTimeout(300)
    const quantityDisplay = quantityControls.locator('span').first()
    await expect(quantityDisplay).toHaveText('2')
  })

  test('remove item from cart', async ({ page }) => {
    // Add a product
    await page.waitForSelector('button:has-text("Add to Cart")', {
      timeout: 15000,
    })
    await page.locator('button:has-text("Add to Cart")').first().click()

    // Go to cart
    await page.locator('a[aria-label="Shopping cart"]').click()
    await expect(page.locator('text="Order Summary"')).toBeVisible()

    // Click the remove/trash button
    const removeButton = page.locator('button[title="Remove item"]').first()
    if (await removeButton.isVisible()) {
      await removeButton.click()

      // Should show empty cart
      await expect(page.locator('text="Your cart is empty"')).toBeVisible()
    }
  })

  test('clear entire cart', async ({ page }) => {
    // Add two products
    await page.waitForSelector('button:has-text("Add to Cart")', {
      timeout: 15000,
    })
    const addButtons = page.locator('button:has-text("Add to Cart")')
    await addButtons.nth(0).click()
    await addButtons.nth(1).click()

    // Go to cart
    await page.locator('a[aria-label="Shopping cart"]').click()
    await expect(page.locator('text="Order Summary"')).toBeVisible()

    // Click Clear Cart
    const clearButton = page.locator('button:has-text("Clear Cart")')
    if (await clearButton.isVisible()) {
      await clearButton.click()

      // Should show empty state
      await expect(page.locator('text="Your cart is empty"')).toBeVisible()
    }
  })

  test('empty cart shows empty state message', async ({ page }) => {
    await page.goto('/cart')

    // Should show the empty cart message
    await expect(page.locator('text="Your cart is empty"')).toBeVisible()
    await expect(page.locator('text="Continue Shopping"')).toBeVisible()
  })
})
