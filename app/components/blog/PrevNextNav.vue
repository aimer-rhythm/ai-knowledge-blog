<script setup lang="ts">
const { t } = useI18n()

interface NavItem {
  path: string
  title: string
}

defineProps<{
  prev: NavItem | null
  next: NavItem | null
}>()
</script>

<template>
  <nav class="mt-12 grid grid-cols-1 gap-4 border-t border-zinc-200/50 dark:border-zinc-800/50 pt-8 sm:grid-cols-2">
    <!-- Previous article -->
    <NuxtLink
      v-if="prev"
      :to="prev.path"
      class="group flex items-center gap-3 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm p-4 transition-all duration-300 hover:border-primary-400/40 hover:bg-primary-50/30 dark:hover:border-primary-500/30 dark:hover:bg-primary-900/10"
    >
      <svg
        class="h-5 w-5 shrink-0 text-zinc-400 transition-transform group-hover:-translate-x-1 group-hover:text-primary-600 dark:text-zinc-600 dark:group-hover:text-primary-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      <div class="min-w-0">
        <div class="text-xs text-zinc-500 dark:text-zinc-500">{{ t('blog.prev') }}</div>
        <div
          class="truncate text-sm font-medium text-zinc-900 transition-colors group-hover:text-primary-600 dark:text-zinc-100 dark:group-hover:text-primary-400"
        >
          {{ prev.title }}
        </div>
      </div>
    </NuxtLink>
    <div v-else />

    <!-- Next article -->
    <NuxtLink
      v-if="next"
      :to="next.path"
      class="group flex items-center justify-end gap-3 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm p-4 text-right transition-all duration-300 hover:border-primary-400/40 hover:bg-primary-50/30 dark:hover:border-primary-500/30 dark:hover:bg-primary-900/10"
    >
      <div class="min-w-0">
        <div class="text-xs text-zinc-500 dark:text-zinc-500">{{ t('blog.next') }}</div>
        <div
          class="truncate text-sm font-medium text-zinc-900 transition-colors group-hover:text-primary-600 dark:text-zinc-100 dark:group-hover:text-primary-400"
        >
          {{ next.title }}
        </div>
      </div>
      <svg
        class="h-5 w-5 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-primary-600 dark:text-zinc-600 dark:group-hover:text-primary-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </NuxtLink>
    <div v-else />
  </nav>
</template>
