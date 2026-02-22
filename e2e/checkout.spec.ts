import { test, expect } from '@playwright/test'

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage for a fresh start
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('full checkout happy path', async ({ page }) => {
    // 1. Wait for products to load
    await page.waitForSelector('button:has-text("Add to Cart")', {
      timeout: 15000,
    })

    // 2. Add a product to cart
    await page.locator('button:has-text("Add to Cart")').first().click()

    // 3. Navigate to cart
    await page.locator('a[aria-label="Shopping cart"]').click()
    await expect(page.locator('text="Order Summary"')).toBeVisible()

    // 4. Click Checkout
    await page.locator('a:has-text("Checkout")').click()

    // 5. Fill in the checkout form
    await page.fill('#name', 'John Doe')
    await page.fill('#email', 'john@example.com')
    await page.fill('#address', '123 Main Street, Springfield')

    // 6. Submit order
    await page.click('button:has-text("Place Order")')

    // 7. Should show confirmation
    await expect(page.locator('text="Order Confirmed!"')).toBeVisible({
      timeout: 10000,
    })
    await expect(
      page.locator('text="Thank you for your purchase."'),
    ).toBeVisible()
  })

  test('shows validation errors on empty form submit', async ({ page }) => {
    // Add item and navigate to checkout
    await page.waitForSelector('button:has-text("Add to Cart")', {
      timeout: 15000,
    })
    await page.locator('button:has-text("Add to Cart")').first().click()

    await page.locator('a[aria-label="Shopping cart"]').click()
    await expect(page.locator('text="Order Summary"')).toBeVisible()

    await page.locator('a:has-text("Checkout")').click()

    // Submit without filling form
    await page.click('button:has-text("Place Order")')

    // Should show validation errors
    await expect(page.locator('text="Name is required"')).toBeVisible()
    await expect(page.locator('text="Invalid email address"')).toBeVisible()
    await expect(page.locator('text="Address is required"')).toBeVisible()
  })

  test('empty cart prevents checkout access', async ({ page }) => {
    await page.goto('/checkout')

    // Should show message about empty cart
    await expect(page.locator('text="Your cart is empty."')).toBeVisible()
    await expect(page.locator('text="Go back to shopping"')).toBeVisible()
  })
})
