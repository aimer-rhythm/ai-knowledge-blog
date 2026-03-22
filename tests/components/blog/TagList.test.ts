import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TagList from '../../../app/components/blog/TagList.vue'

const NuxtLinkStub = {
  name: 'NuxtLink',
  template: '<a :href="to"><slot /></a>',
  props: ['to'],
}

function mountTagList(props: { tags: string[]; size?: 'sm' | 'md' | 'lg' }) {
  return mount(TagList, {
    props,
    global: {
      stubs: { NuxtLink: NuxtLinkStub },
    },
  })
}

describe('TagList', () => {
  it('renders all tags as links', () => {
    const wrapper = mountTagList({ tags: ['Vue', 'Nuxt', 'Testing'] })
    const links = wrapper.findAll('a')
    expect(links).toHaveLength(3)
    expect(links[0].text()).toBe('Vue')
    expect(links[1].text()).toBe('Nuxt')
    expect(links[2].text()).toBe('Testing')
  })

  it('renders correct href for each tag', () => {
    const wrapper = mountTagList({ tags: ['Vue', 'Nuxt'] })
    const links = wrapper.findAll('a')
    expect(links[0].attributes('href')).toBe('/tags/Vue')
    expect(links[1].attributes('href')).toBe('/tags/Nuxt')
  })

  it('applies sm size classes by default', () => {
    const wrapper = mountTagList({ tags: ['Test'] })
    expect(wrapper.html()).toContain('px-2')
    expect(wrapper.html()).toContain('py-0.5')
    expect(wrapper.html()).toContain('text-xs')
  })

  it('applies md size classes', () => {
    const wrapper = mountTagList({ tags: ['Test'], size: 'md' })
    expect(wrapper.html()).toContain('px-3')
    expect(wrapper.html()).toContain('py-1')
    expect(wrapper.html()).toContain('text-sm')
  })

  it('applies lg size classes', () => {
    const wrapper = mountTagList({ tags: ['Test'], size: 'lg' })
    expect(wrapper.html()).toContain('px-4')
    expect(wrapper.html()).toContain('py-1.5')
    expect(wrapper.html()).toContain('text-base')
  })

  it('generates consistent colors for the same tag', () => {
    const wrapper = mountTagList({ tags: ['Consistency', 'Consistency'] })
    const links = wrapper.findAll('a')
    expect(links[0].classes().join(' ')).toBe(links[1].classes().join(' '))
  })

  it('renders nothing when tags array is empty', () => {
    const wrapper = mountTagList({ tags: [] })
    expect(wrapper.findAll('a')).toHaveLength(0)
  })
})
