async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return
  }

  const { worker } = await import('./mocks/browser')

  if (import.meta.env.VITE_MSW === 'true') {
    await worker.start()
  }
}

enableMocking().then(() => {
  import('./bootstrap')
})
