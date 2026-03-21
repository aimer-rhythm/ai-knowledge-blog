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

const props = defineProps<{
  article: Article
}>()

function truncate(text: string | undefined, length: number): string {
  if (!text) return ''
  return text.length > length ? text.slice(0, length) + '...' : text
}
</script>

<template>
  <NuxtLink
    :to="article.path"
    class="group block relative bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl p-4 border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
  >
    <!-- Hover Glow -->
    <div class="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary-500/5 to-purple-500/5 pointer-events-none" />

    <div class="relative flex flex-col gap-4 sm:gap-5 z-10">
      <!-- Image / Placeholder -->
      <BlogArticleCover
        :title="article.title"
        :category="article.category"
        :image="article.image"
      />

      <!-- Content -->
      <div class="flex flex-col flex-1 px-1">
        <!-- Meta -->
        <div class="flex items-center gap-3 mb-3 text-xs font-medium text-zinc-400 dark:text-zinc-500">
          <time :datetime="article.date">{{ formatContentDate(article.date, localeCode) }}</time>
          <span v-if="article.readingTime" class="flex items-center gap-1">
            <span class="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            {{ t('blog.readingTime', { n: article.readingTime }) }}
          </span>
        </div>

        <!-- Title -->
        <h3
          class="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 line-clamp-2"
        >
          {{ article.title }}
        </h3>

        <!-- Description -->
        <p class="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-2">
          {{ article.description }}
        </p>

        <!-- Tags -->
        <div v-if="article.tags?.length" class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="tag in article.tags.slice(0, 3)"
            :key="tag"
            class="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            #{{ tag }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
