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
  <section v-if="articles.length" class="mt-12 border-t border-zinc-200/50 dark:border-zinc-800/50 pt-8">
    <h2 class="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">
      {{ t('blog.related') }}
    </h2>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="article in articles.slice(0, 3)"
        :key="article.path"
        :to="article.path"
        class="group overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:hover:border-zinc-700"
      >
        <!-- Image -->
        <div v-if="article.image" class="relative h-36 overflow-hidden">
          <NuxtImg
            :src="article.image"
            :alt="article.title"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            width="400"
            height="144"
          />
        </div>

        <!-- Text content -->
        <div class="p-4">
          <h3
            class="mb-1.5 line-clamp-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400"
          >
            {{ article.title }}
          </h3>
          <time
            :datetime="article.date"
            class="text-xs text-zinc-500 dark:text-zinc-500"
          >
            {{ formatContentDate(article.date, localeCode) }}
          </time>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
