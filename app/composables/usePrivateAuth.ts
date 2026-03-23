export function usePrivateAuth() {
  const isUnlocked = useState<boolean>('private-admin', () => {
    if (import.meta.server) {
      return useRequestEvent()?.context?.isPrivateAdmin === true
    }
    return false
  })

  // On client, check status if not already unlocked
  if (import.meta.client && !isUnlocked.value) {
    onMounted(async () => {
      try {
        const data = await $fetch<{ isUnlocked: boolean }>('/api/admin-check')
        if (data.isUnlocked) {
          isUnlocked.value = true
        }
      } catch {
        // Fail silent
      }
    })
  }

  async function login(key: string): Promise<boolean> {
    try {
      await $fetch('/api/admin-login', {
        method: 'POST',
        body: { key },
      })
      return true
    } catch {
      return false
    }
  }

  async function logout(): Promise<void> {
    await $fetch('/api/admin-logout', { method: 'POST' })
  }

  return { isUnlocked, login, logout }
}
