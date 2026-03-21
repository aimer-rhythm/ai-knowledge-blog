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
  articles: Article[]
}>()

</script>

<template>
  <section v-if="articles.length" class="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
    <h2 class="mb-6 text-xl font-bold text-gray-900 dark:text-gray-100">
      {{ t('blog.related') }}
    </h2>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <a
        v-for="article in articles.slice(0, 3)"
        :key="article.path"
        :href="article.path"
        class="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
      >
        <!-- Image -->
        <div v-if="article.image" class="relative h-36 overflow-hidden">
          <NuxtImg
            :src="article.image"
            :alt="article.title"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            width="400"
            height="144"
          />
        </div>

        <!-- Text content -->
        <div class="p-4">
          <h3
            class="mb-1.5 line-clamp-2 text-sm font-semibold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400"
          >
            {{ article.title }}
          </h3>
          <time
            :datetime="article.date"
            class="text-xs text-gray-500 dark:text-gray-500"
          >
            {{ formatContentDate(article.date, localeCode) }}
          </time>
        </div>
      </a>
    </div>
  </section>
</template>
