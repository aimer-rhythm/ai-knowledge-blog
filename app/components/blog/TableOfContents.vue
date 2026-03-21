<script setup lang="ts">
const { t } = useI18n()

interface TocLink {
  id: string
  text: string
  children?: TocLink[]
}

defineProps<{
  links: TocLink[]
}>()

const activeId = ref('')

function scrollToHeading(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(() => {
  const headings = document.querySelectorAll('h2[id], h3[id]')
  if (!headings.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      }
    },
    {
      rootMargin: '-80px 0px -70% 0px',
      threshold: 0,
    }
  )

  headings.forEach((heading) => observer.observe(heading))

  onUnmounted(() => {
    observer.disconnect()
  })
})
</script>

<template>
  <nav
    v-if="links.length"
    class="max-h-[calc(100vh-10rem)] overflow-y-auto pr-2 custom-scrollbar"
  >
    <h2 class="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
      <svg class="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
      {{ t('blog.toc') }}
    </h2>

    <ul class="space-y-1.5 border-l-2 border-zinc-100 dark:border-zinc-800/80 ml-2 pl-3">
      <li v-for="link in links" :key="link.id">
        <button
          class="w-full text-left text-[13px] font-medium transition-all duration-200 py-1"
          :class="
            activeId === link.id
              ? 'text-primary-600 dark:text-primary-400 translate-x-1'
              : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
          "
          @click="scrollToHeading(link.id)"
        >
          {{ link.text }}
        </button>

        <!-- Nested headings (h3) -->
        <ul v-if="link.children?.length" class="mt-1.5 space-y-1.5 pl-3">
          <li v-for="child in link.children" :key="child.id">
            <button
              class="w-full text-left text-xs font-normal transition-all duration-200 py-1"
              :class="
                activeId === child.id
                  ? 'text-primary-600 dark:text-primary-400 translate-x-1'
                  : 'text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300'
              "
              @click="scrollToHeading(child.id)"
            >
              {{ child.text }}
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: theme('colors.zinc.200');
  border-radius: 4px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: theme('colors.zinc.700');
}
</style>
