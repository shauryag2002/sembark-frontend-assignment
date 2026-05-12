import { expect, test } from '@playwright/test'

test('product detail -> cart flow works', async ({ page, request }) => {
  const productsResponse = await request.get('https://api.escuelajs.co/api/v1/products?offset=0&limit=1')
  const products = (await productsResponse.json()) as Array<{ id: number }>
  const productId = products[0]?.id

  expect(productId).toBeTruthy()

  await page.goto('/')

  await expect(page.getByText('Store')).toBeVisible()
  await page.goto(`/product/${productId}`)
  await expect(page).toHaveURL(new RegExp(`/product/${productId}`))
  await expect(page.getByRole('button', { name: 'Add to Cart' })).toBeVisible()

  await page.getByRole('button', { name: 'Add to Cart' }).click()
  await page.getByRole('button', { name: 'View Cart' }).click()

  await expect(page).toHaveURL('/cart')
  await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible()
  await expect(page.getByText('Order Summary')).toBeVisible()
})

test('sort query survives refresh and keeps selected value', async ({ page }) => {
  await page.goto('/')

  const sortSelect = page.locator('select').first()
  await sortSelect.selectOption('price_asc')

  await expect(page).toHaveURL(/sort=price_asc/)
  await page.reload()

  await expect(sortSelect).toHaveValue('price_asc')
})
