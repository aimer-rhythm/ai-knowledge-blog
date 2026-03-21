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
  <nav class="mt-12 grid grid-cols-1 gap-4 border-t border-gray-200 pt-8 dark:border-gray-800 sm:grid-cols-2">
    <!-- Previous article -->
    <a
      v-if="prev"
      :href="prev.path"
      class="group flex items-center gap-3 rounded-xl border border-gray-200 p-4 transition-all hover:border-primary-300 hover:bg-primary-50/50 dark:border-gray-800 dark:hover:border-primary-700 dark:hover:bg-primary-900/10"
    >
      <svg
        class="h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:-translate-x-1 group-hover:text-primary-600 dark:text-gray-600 dark:group-hover:text-primary-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      <div class="min-w-0">
        <div class="text-xs text-gray-500 dark:text-gray-500">{{ t('blog.prev') }}</div>
        <div
          class="truncate text-sm font-medium text-gray-900 transition-colors group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400"
        >
          {{ prev.title }}
        </div>
      </div>
    </a>
    <div v-else />

    <!-- Next article -->
    <a
      v-if="next"
      :href="next.path"
      class="group flex items-center justify-end gap-3 rounded-xl border border-gray-200 p-4 text-right transition-all hover:border-primary-300 hover:bg-primary-50/50 dark:border-gray-800 dark:hover:border-primary-700 dark:hover:bg-primary-900/10"
    >
      <div class="min-w-0">
        <div class="text-xs text-gray-500 dark:text-gray-500">{{ t('blog.next') }}</div>
        <div
          class="truncate text-sm font-medium text-gray-900 transition-colors group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400"
        >
          {{ next.title }}
        </div>
      </div>
      <svg
        class="h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-primary-600 dark:text-gray-600 dark:group-hover:text-primary-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </a>
    <div v-else />
  </nav>
</template>
