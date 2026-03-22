<script setup lang="ts">
import { formatContentDate } from '~/utils/content'

const { t, locale } = useI18n()
const localeCode = computed(() => unref(locale))

interface ReadingNavArticle {
  path: string
  title: string
  date: string
}

interface ReadingNavGroup {
  key: string
  name?: string
  count: number
  isCurrent: boolean
  articles: ReadingNavArticle[]
}

defineProps<{
  groups: ReadingNavGroup[]
  currentPath: string
}>()

function getCategoryLabel(name?: string): string {
  return name || t('categories.uncategorized')
}
</script>

<template>
  <nav
    v-if="groups.length"
    class="max-h-[calc(100vh-10rem)] overflow-y-auto pr-1 custom-scrollbar"
  >
    <div class="mb-5 px-1">
      <p class="text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-400 dark:text-zinc-500">
        {{ t('categories.title') }}
      </p>
      <h2 class="mt-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        {{ t('blog.quickSwitch') }}
      </h2>
    </div>

    <div class="space-y-3">
      <details
        v-for="group in groups"
        :key="group.key"
        :open="group.isCurrent"
        class="group rounded-2xl border border-zinc-200/70 bg-white/70 p-3 shadow-sm transition-colors dark:border-zinc-800/70 dark:bg-zinc-900/60"
      >
        <summary class="flex cursor-pointer list-none items-start justify-between gap-3 marker:hidden">
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span
                class="inline-flex h-2.5 w-2.5 shrink-0 rounded-full"
                :class="group.isCurrent ? 'bg-primary-500 shadow-[0_0_0_4px_rgba(59,130,246,0.12)]' : 'bg-zinc-300 dark:bg-zinc-700'"
              />
              <h3
                class="truncate text-sm font-semibold"
                :class="group.isCurrent ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-700 dark:text-zinc-300'"
              >
                {{ getCategoryLabel(group.name) }}
              </h3>
            </div>
            <p class="mt-1 pl-[18px] text-[11px] text-zinc-400 dark:text-zinc-500">
              {{ t('blog.count', { n: group.count }) }}
            </p>
          </div>

          <svg
            class="mt-0.5 h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 group-open:rotate-90"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </summary>

        <div class="mt-3 space-y-1 border-t border-zinc-200/70 pt-3 dark:border-zinc-800/70">
          <NuxtLink
            v-for="item in group.articles"
            :key="item.path"
            :to="item.path"
            class="flex items-start justify-between gap-3 rounded-xl px-3 py-2.5 transition-all duration-200"
            :class="
              item.path === currentPath
                ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-200/80 dark:bg-primary-950/40 dark:text-primary-300 dark:ring-primary-900/60'
                : 'text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-100'
            "
          >
            <span class="line-clamp-2 text-[13px] leading-5">
              {{ item.title }}
            </span>
            <time
              :datetime="item.date"
              class="shrink-0 pt-0.5 text-[11px] tabular-nums opacity-70"
            >
              {{ formatContentDate(item.date, localeCode, { month: 'numeric', day: 'numeric' }) }}
            </time>
          </NuxtLink>
        </div>
      </details>
    </div>
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
  border-radius: 9999px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: theme('colors.zinc.700');
}
</style>
