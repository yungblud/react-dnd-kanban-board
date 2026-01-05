import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import GlobalStyle from './styles/global-style.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { getQueryClient } from './lib/query-client.ts'

const queryClient = getQueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
    <GlobalStyle />
  </StrictMode>
)
