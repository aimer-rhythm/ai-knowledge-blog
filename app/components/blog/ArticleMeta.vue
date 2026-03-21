<script setup lang="ts">
import { formatContentDate } from '~/utils/content'

const { t, locale } = useI18n()
const localeCode = computed(() => unref(locale))

interface Article {
  path: string
  title: string
  description?: string
  image?: string
  date: string
  category?: string
  tags?: string[]
  readingTime?: number
}

defineProps<{
  article: Article
}>()

</script>

<template>
  <div
    class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400"
  >
    <!-- Date -->
    <time :datetime="article.date" class="flex items-center gap-1.5">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      {{ formatContentDate(article.date, localeCode) }}
    </time>

    <!-- Divider -->
    <span
      v-if="article.category"
      class="hidden h-4 w-px bg-gray-300 dark:bg-gray-700 sm:block"
    />

    <!-- Category -->
    <NuxtLink
      v-if="article.category"
      :to="`/categories/${article.category}`"
      class="flex items-center gap-1.5 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>
      {{ article.category }}
    </NuxtLink>

    <!-- Divider -->
    <span
      v-if="article.tags?.length"
      class="hidden h-4 w-px bg-gray-300 dark:bg-gray-700 sm:block"
    />

    <!-- Tags -->
    <div v-if="article.tags?.length" class="flex flex-wrap items-center gap-2">
      <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
      <NuxtLink
        v-for="tag in article.tags"
        :key="tag"
        :to="`/tags/${tag}`"
        class="rounded-full bg-gray-100 px-2 py-0.5 text-xs transition-colors hover:bg-primary-100 hover:text-primary-700 dark:bg-gray-800 dark:hover:bg-primary-900/30 dark:hover:text-primary-300"
      >
        {{ tag }}
      </NuxtLink>
    </div>

    <!-- Divider -->
    <span
      v-if="article.readingTime"
      class="hidden h-4 w-px bg-gray-300 dark:bg-gray-700 sm:block"
    />

    <!-- Reading time -->
    <span v-if="article.readingTime" class="flex items-center gap-1.5">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {{ t('blog.readingTime', { n: article.readingTime }) }}
    </span>
  </div>
</template>
