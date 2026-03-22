<script setup lang="ts">
const { t } = useI18n()
const { categories } = useCategories()

const categoryDescriptions = computed<Record<string, string>>(() => ({
  '机器学习': t('categories.descriptionMachineLearning'),
  '深度学习': t('categories.descriptionDeepLearning'),
  '自然语言处理': t('categories.descriptionNlp'),
  '计算机视觉': t('categories.descriptionCv'),
  '强化学习': t('categories.descriptionRl'),
  '数据科学': t('categories.descriptionDataScience'),
  'AI工程': t('categories.descriptionAiEngineering'),
  '数学基础': t('categories.descriptionMath'),
}))

useHead({
  title: `${t('categories.title')} - ${t('hero.title')}`,
  meta: [
    { name: 'description', content: t('categories.subtitle') },
  ],
})
</script>

<template>
  <div class="container-content py-10 lg:py-16">
    <header class="mb-12">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
        {{ t('categories.title') }}
      </h1>
      <p class="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
        {{ t('categories.subtitle') }}
      </p>
    </header>

    <!-- Loading -->
    <div v-if="!categories" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="i in 8"
        :key="i"
        class="skeleton-shimmer rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40 p-6"
      >
        <div class="h-6 bg-zinc-200 dark:bg-zinc-700 rounded-md w-1/2 mb-4" />
        <div class="h-4 bg-zinc-200 dark:bg-zinc-700 rounded-md w-3/4 mb-3" />
        <div class="h-4 bg-zinc-200 dark:bg-zinc-700 rounded-md w-1/4" />
      </div>
    </div>

    <!-- Categories Grid -->
    <div v-else-if="categories?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <BlogCategoryCard
        v-for="cat in categories"
        :key="cat.name"
        :name="cat.name"
        :count="cat.count"
        :image="cat.image"
        :description="categoryDescriptions[cat.name] || undefined"
      />
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-20 bg-white/40 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl backdrop-blur-sm">
      <svg class="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-600 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
      <p class="text-zinc-500 dark:text-zinc-400 text-lg font-medium">
        {{ t('categories.empty') }}
      </p>
      <p class="mt-2 text-sm text-zinc-400 dark:text-zinc-600">
        {{ t('blog.emptyHint') }}
      </p>
    </div>
  </div>
</template>
