import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'
import { queryClient } from './lib/query-client'
import { CartProvider } from './domains/cart/cart.context'
import { ToastProvider } from './domains/toast/toast.context'
import { ToastContainer } from './components/Toast'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    context: {
      queryClient,
    },
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    // This wraps the entire app in the provider
    Wrap: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <CartProvider>
            {children}
            <ToastContainer />
          </CartProvider>
        </ToastProvider>
      </QueryClientProvider>
    ),
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
