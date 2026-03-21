<script setup lang="ts">
const { t } = useI18n()

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const visiblePages = computed(() => {
  const pages: number[] = []
  const total = props.totalPages
  const current = props.currentPage

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
    return pages
  }

  // Always show first page
  pages.push(1)

  if (current > 3) {
    pages.push(-1) // ellipsis marker
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) {
    pages.push(-2) // ellipsis marker
  }

  // Always show last page
  pages.push(total)

  return pages
})

function goToPage(page: number) {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('update:currentPage', page)
  }
}
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="flex items-center justify-center gap-1"
    :aria-label="t('common.pagination')"
  >
    <!-- Previous -->
    <button
      :disabled="currentPage <= 1"
      class="inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
      :class="
        currentPage > 1
          ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          : 'text-gray-400 dark:text-gray-600'
      "
      @click="goToPage(currentPage - 1)"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      {{ t('blog.prev') }}
    </button>

    <!-- Page numbers -->
    <template v-for="page in visiblePages" :key="page">
      <!-- Ellipsis -->
      <span
        v-if="page < 0"
        class="inline-flex h-9 w-9 items-center justify-center text-sm text-gray-400 dark:text-gray-600"
      >
        ...
      </span>

      <!-- Page button -->
      <button
        v-else
        class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors"
        :class="
          page === currentPage
            ? 'bg-primary-600 text-white shadow-sm dark:bg-primary-500'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        "
        :aria-current="page === currentPage ? 'page' : undefined"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
    </template>

    <!-- Next -->
    <button
      :disabled="currentPage >= totalPages"
      class="inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
      :class="
        currentPage < totalPages
          ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          : 'text-gray-400 dark:text-gray-600'
      "
      @click="goToPage(currentPage + 1)"
    >
      {{ t('blog.next') }}
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </nav>
</template>
