<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const categoryName = computed(() => decodeURIComponent(route.params.name as string))
const currentPage = computed(() => Number(route.query.page) || 1)

const { articles, totalCount, totalPages, pending } = useArticles({
  category: categoryName,
  page: currentPage,
  perPage: 9,
})

function onPageChange(page: number) {
  router.push({ query: { ...route.query, page: page > 1 ? page : undefined } })
}

useHead({
  title: () => `${categoryName.value} - ${t('categories.title')} - ${t('hero.title')}`,
  meta: [
    { name: 'description', content: () => t('categories.description', { name: categoryName.value }) },
  ],
})
</script>

<template>
  <div class="container-content py-10 lg:py-16">
    <header class="mb-12">
      <nav class="mb-6">
        <NuxtLink
          to="/categories"
          class="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          {{ t('categories.all') }}
        </NuxtLink>
      </nav>
      <h1 class="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
        {{ categoryName }}
      </h1>
      <p class="mt-4 inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
        {{ t('blog.count', { n: totalCount }) }}
      </p>
    </header>

    <!-- Loading -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="i in 6"
        :key="i"
        class="animate-pulse"
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

    <!-- Articles -->
    <div v-else-if="articles?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
      <BlogArticleCard
        v-for="article in articles"
        :key="article.path"
        :article="article"
      />
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-20 bg-white/40 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl backdrop-blur-sm">
      <p class="text-zinc-500 dark:text-zinc-400 text-lg font-medium">
        {{ t('blog.categoryEmpty') }}
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
  </div>
</template>
