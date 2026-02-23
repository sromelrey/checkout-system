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

    console.log(`[Mock API] Not found: ${req.url}`)
    res.writeHead(404)
    res.end()
  })

  // Start mock server on dynamic port (0) to avoid EADDRINUSE collisions
  await new Promise<void>((resolve) => {
    server.listen(0, () => resolve())
  })

  // Get the assigned dynamic port
  const address = server.address()
  const port = typeof address === 'string' ? 3001 : address?.port

  // Set the environment variable so the webServer picks it up
  process.env.VITE_API_URL = `http://localhost:${port}`

  // Return a teardown function
  return () => {
    return new Promise((resolve) => server.close(resolve))
  }
}
