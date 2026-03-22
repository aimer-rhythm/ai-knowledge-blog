import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import AdminGate from '../../../app/components/blog/AdminGate.vue'

const loginMock = vi.fn()

// Mock vue-i18n module
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'adminGate.title': 'Private Content',
        'adminGate.description': 'Enter key to access',
        'adminGate.placeholder': 'Enter key',
        'adminGate.error': 'Invalid key',
        'adminGate.submit': 'Verify',
        'adminGate.verifying': 'Verifying...',
      }
      return map[key] ?? key
    },
    locale: ref('en'),
  }),
}))

// Mock the composable at its actual file path (resolved by Nuxt auto-imports)
vi.mock('../../../app/composables/usePrivateAuth', () => ({
  usePrivateAuth: () => ({
    login: loginMock,
    isUnlocked: ref(false),
  }),
}))

describe('AdminGate', () => {
  beforeEach(() => {
    loginMock.mockReset()
    loginMock.mockResolvedValue(true)
  })

  function mountGate() {
    return mount(AdminGate, { attachTo: document.body })
  }

  it('renders the password form', () => {
    const wrapper = mountGate()
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('focuses input on mount', async () => {
    const wrapper = mountGate()
    await nextTick()
    await nextTick()
    const input = wrapper.find('input')
    expect(input.element).toBe(document.activeElement)
    wrapper.unmount()
  })

  it('does not call login with empty input', async () => {
    const wrapper = mountGate()
    await wrapper.find('form').trigger('submit')
    expect(loginMock).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('calls login with the entered key', async () => {
    const wrapper = mountGate()
    await wrapper.find('input').setValue('my-secret')
    await wrapper.find('form').trigger('submit')
    expect(loginMock).toHaveBeenCalledWith('my-secret')
    wrapper.unmount()
  })

  it('prevents double submission while loading', async () => {
    let resolveLogin!: (v: boolean) => void
    loginMock.mockReturnValue(new Promise(res => { resolveLogin = res }))

    const wrapper = mountGate()
    await wrapper.find('input').setValue('secret')
    await wrapper.find('form').trigger('submit')
    await wrapper.find('form').trigger('submit')

    expect(loginMock).toHaveBeenCalledTimes(1)
    resolveLogin(true)
    wrapper.unmount()
  })

  it('shows error and clears input on failed login', async () => {
    loginMock.mockResolvedValue(false)

    const wrapper = mountGate()
    const input = wrapper.find('input')

    await input.setValue('wrong-key')
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    await nextTick()

    expect((input.element as HTMLInputElement).value).toBe('')
    expect(wrapper.text()).toContain('Invalid key')
    wrapper.unmount()
  })

  it('shows submit button text', () => {
    const wrapper = mountGate()
    expect(wrapper.find('button[type="submit"]').text()).toBe('Verify')
    wrapper.unmount()
  })
})
