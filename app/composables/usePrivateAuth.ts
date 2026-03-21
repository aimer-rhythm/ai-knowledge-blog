export function usePrivateAuth() {
  const isUnlocked = useState<boolean>('private-admin', () => {
    if (import.meta.server) {
      return useRequestEvent()?.context?.isPrivateAdmin === true
    }
    return false
  })

  async function login(key: string): Promise<boolean> {
    try {
      await $fetch('/api/admin-login', {
        method: 'POST',
        body: { key },
      })
      if (import.meta.client) {
        window.location.reload()
      }
      return true
    } catch {
      return false
    }
  }

  async function logout(): Promise<void> {
    await $fetch('/api/admin-logout', { method: 'POST' })
    if (import.meta.client) {
      window.location.reload()
    }
  }

  return { isUnlocked, login, logout }
}
