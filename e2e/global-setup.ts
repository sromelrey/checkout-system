import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default async function globalSetup() {
  const products = JSON.parse(
    readFileSync(join(__dirname, 'fixtures', 'mock-products.json'), 'utf-8'),
  )

  const server = createServer((req, res) => {
    console.log(`[Mock API] Incoming request: ${req.method} ${req.url}`)

    // Enable CORS to match the real API
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')

    if (req.method === 'OPTIONS') {
      res.writeHead(204)
      res.end()
      return
    }

    if (req.url === '/products') {
      console.log(`[Mock API] Serving ${products.length} products`)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(products))
      return
    }

    if (req.url === '/products/categories') {
      const categories = [...new Set(products.map((p: any) => p.category))]
      console.log(`[Mock API] Serving ${categories.length} categories`)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(categories))
      return
    }

    // Single product API
    if (req.url?.startsWith('/products/')) {
      console.log(`[Mock API] Serving single product ${req.url}`)
      const id = req.url.split('/').pop()
      const product = products.find((p: any) => p.id === Number(id))

      if (product) {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(product))
      } else {
        res.writeHead(404)
        res.end()
      }
      return
    }

    // Cart operations
    if (req.url && /^\/carts(\/|\?|$)/.test(req.url)) {
      console.log(
        `[Mock API] MATCHED /carts! Method: ${req.method}, URL: ${req.url}`,
      )

      if (req.method === 'POST') {
        res.writeHead(201, { 'Content-Type': 'application/json' })
        res.end(
          JSON.stringify({
            id: 11,
            userId: 1,
            date: new Date().toISOString(),
            products: [],
          }),
        )
        return
      }

      if (
        req.method === 'PATCH' ||
        req.method === 'DELETE' ||
        req.method === 'PUT'
      ) {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ id: 1, status: 'success' }))
        return
      }

      console.log(
        `[Mock API] Cart matched but method ${req.method} not handled.`,
      )
    }

    console.log(`[Mock API] Not found: ${req.url}`)
    res.writeHead(404)
    res.end()
  })

  // Start mock server on fixed port 3001 for CI reliability
  const port = 3001
  await new Promise<void>((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve())
  })

  // Set the environment variable just in case, though webServer has its own config
  process.env.VITE_API_URL = `http://127.0.0.1:${port}`

  // Return a teardown function
  return () => {
    return new Promise((resolve) => server.close(resolve))
  }
}
