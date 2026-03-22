import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import PrevNextNav from '../../../app/components/blog/PrevNextNav.vue'

// Mock vue-i18n module
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'blog.prev': 'Previous',
        'blog.next': 'Next',
      }
      return map[key] ?? key
    },
    locale: ref('en'),
  }),
}))

const NuxtLinkStub = {
  name: 'NuxtLink',
  template: '<a :href="to"><slot /></a>',
  props: ['to'],
}

function mountNav(props: { prev: { path: string; title: string } | null; next: { path: string; title: string } | null }) {
  return mount(PrevNextNav, {
    props,
    global: {
      stubs: { NuxtLink: NuxtLinkStub },
    },
  })
}

describe('PrevNextNav', () => {
  it('renders both prev and next links', () => {
    const wrapper = mountNav({
      prev: { path: '/prev', title: 'Previous Post' },
      next: { path: '/next', title: 'Next Post' },
    })
    const links = wrapper.findAll('a')
    expect(links).toHaveLength(2)
    expect(wrapper.text()).toContain('Previous Post')
    expect(wrapper.text()).toContain('Next Post')
  })

  it('renders correct href attributes', () => {
    const wrapper = mountNav({
      prev: { path: '/blog/old', title: 'Old' },
      next: { path: '/blog/new', title: 'New' },
    })
    const links = wrapper.findAll('a')
    expect(links[0].attributes('href')).toBe('/blog/old')
    expect(links[1].attributes('href')).toBe('/blog/new')
  })

  it('renders only prev link when next is null', () => {
    const wrapper = mountNav({
      prev: { path: '/prev', title: 'Previous Post' },
      next: null,
    })
    const links = wrapper.findAll('a')
    expect(links).toHaveLength(1)
    expect(wrapper.text()).toContain('Previous Post')
  })

  it('renders only next link when prev is null', () => {
    const wrapper = mountNav({
      prev: null,
      next: { path: '/next', title: 'Next Post' },
    })
    const links = wrapper.findAll('a')
    expect(links).toHaveLength(1)
    expect(wrapper.text()).toContain('Next Post')
  })

  it('renders no links when both are null', () => {
    const wrapper = mountNav({ prev: null, next: null })
    expect(wrapper.findAll('a')).toHaveLength(0)
  })

  it('shows label text for prev and next', () => {
    const wrapper = mountNav({
      prev: { path: '/prev', title: 'Prev Title' },
      next: { path: '/next', title: 'Next Title' },
    })
    expect(wrapper.text()).toContain('Previous')
    expect(wrapper.text()).toContain('Next')
  })
})
