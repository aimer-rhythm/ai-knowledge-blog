<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const currentPage = computed(() => Number(route.query.page) || 1)

const { articles, totalPages, pending } = useArticles({
  page: currentPage,
  perPage: 9,
})

const { categories } = useCategories()

function onPageChange(page: number) {
  router.push({ query: { ...route.query, page: page > 1 ? page : undefined } })
}

useHead({
  title: `${t('hero.title')} - ${t('hero.subtitle')}`,
  meta: [
    { name: 'description', content: t('footer.description') },
  ],
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-32">
      <!-- Background Patterns -->
      <div class="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-primary-100/40 dark:bg-primary-900/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen" />
        <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-100/40 dark:bg-blue-900/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen" />
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100/30 dark:bg-purple-900/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen" />
      </div>
      
      <div class="container-content relative text-center">
        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 via-primary-700 to-primary-600 dark:from-zinc-100 dark:via-primary-300 dark:to-primary-400 bg-clip-text text-transparent">
          {{ t('hero.title') }}
        </h1>
        <p class="mt-6 text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          {{ t('hero.subtitle') }}
        </p>
        <div class="mt-10 flex flex-wrap justify-center gap-4">
          <NuxtLink
            to="/categories"
            class="inline-flex items-center px-6 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-zinc-200 dark:shadow-none"
          >
            {{ t('hero.browse') }}
          </NuxtLink>
          <NuxtLink
            to="/archives"
            class="inline-flex items-center px-6 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-300"
          >
            {{ t('hero.archives') }}
          </NuxtLink>
        </div>

        <!-- Explore Topics -->
        <div v-if="categories?.length" class="mt-16 flex flex-col items-center gap-5">
          <p class="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
            {{ t('blog.exploreTopics') }}
          </p>
          <div class="flex flex-wrap justify-center gap-2 max-w-2xl">
            <NuxtLink
              v-for="category in categories.slice(0, 5)"
              :key="category.name"
              :to="`/categories/${category.name}`"
              class="px-4 py-2 rounded-full bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:border-primary-500/50 dark:hover:border-primary-500/50 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-all duration-300 shadow-sm hover:shadow"
            >
              {{ category.name }}
              <span class="ml-1.5 opacity-60 text-xs">{{ category.count }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Articles -->
    <section class="container-content pb-20">
      <div class="flex items-center justify-between mb-10">
        <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {{ t('blog.latest') }}
        </h2>
        <div class="h-px flex-1 bg-zinc-100 dark:bg-zinc-800 ml-6 hidden sm:block" />
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="i in 6"
          :key="i"
          class="skeleton-shimmer rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40 p-4"
        >
          <div class="aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-2xl mb-4" />
          <div class="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-1/4 mb-4" />
          <div class="h-8 bg-zinc-100 dark:bg-zinc-800 rounded w-3/4 mb-4" />
          <div class="space-y-2">
            <div class="h-3 bg-zinc-100 dark:bg-zinc-800 rounded" />
            <div class="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-5/6" />
          </div>
        </div>
      </div>

      <!-- Articles Grid -->
      <div v-else-if="articles?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        <BlogArticleCard
          v-for="article in articles"
          :key="article.path"
          :article="article"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
        <svg class="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-600 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        <p class="text-zinc-400 dark:text-zinc-500 text-lg font-medium">
          {{ t('blog.empty') }}
        </p>
        <p class="mt-2 text-sm text-zinc-400 dark:text-zinc-600">
          {{ t('blog.emptyHint') }}
        </p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-16 flex justify-center">
        <BlogPagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @update:current-page="onPageChange"
        />
      </div>
    </section>
  </div>
</template>
