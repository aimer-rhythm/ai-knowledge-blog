<script setup lang="ts">
import { compareContentDatesDesc, isPrivateArticle } from '~/utils/content'

const { t } = useI18n()
const { isUnlocked, logout } = usePrivateAuth()

interface PrivateArticle {
  path: string
  title: string
  description?: string
  image?: string
  date: string
  category?: string
  tags?: string[]
}

const { data: privateArticles, pending } = await useAsyncData('private-articles', () =>
  queryCollection('content')
    .select('path', 'title', 'description', 'image', 'date', 'category', 'tags', 'private')
    .all()
    .then(results => results.filter(r => isPrivateArticle(r as any)).sort(compareContentDatesDesc) as unknown as PrivateArticle[]),
)

const totalCount = computed(() => privateArticles.value?.length ?? 0)

const groupedByCategory = computed(() => {
  if (!privateArticles.value?.length) return []

  const map = new Map<string, PrivateArticle[]>()

  for (const article of privateArticles.value) {
    const cat = article.category || t('categories.uncategorized')
    if (!map.has(cat)) map.set(cat, [])
    map.get(cat)!.push(article)
  }

  return [...map.entries()]
    .map(([name, articles]) => ({ name, articles }))
    .sort((a, b) => b.articles.length - a.articles.length)
})

const isLoggingOut = ref(false)

async function handleLogout() {
  isLoggingOut.value = true
  await logout()
}

useHead({
  title: () => `${t('adminGate.listTitle')} - ${t('hero.title')}`,
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})
</script>

<template>
  <div class="container-content py-10 lg:py-16">
    <!-- Not authenticated: show login -->
    <BlogAdminGate v-if="!isUnlocked" />

    <!-- Authenticated: show private articles -->
    <template v-else>
      <header class="mb-12">
        <div class="flex items-center justify-between">
          <h1 class="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {{ t('adminGate.listTitle') }}
          </h1>
          <button
            :disabled="isLoggingOut"
            class="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
            @click="handleLogout"
          >
            {{ t('adminGate.logout') }}
          </button>
        </div>
        <p class="mt-4 text-zinc-500 dark:text-zinc-400">
          {{ t('adminGate.listSubtitle') }}
        </p>
        <p class="mt-2 inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          {{ t('blog.count', { n: totalCount }) }}
        </p>
      </header>

      <!-- Loading -->
      <div v-if="pending" class="space-y-8">
        <div v-for="i in 2" :key="i" class="animate-pulse">
          <div class="h-8 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-xl w-32 mb-6" />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="j in 2" :key="j" class="bg-zinc-200/60 dark:bg-zinc-800/60 rounded-3xl h-64" />
          </div>
        </div>
      </div>

      <template v-else-if="privateArticles?.length">
        <div class="space-y-14">
          <section v-for="group in groupedByCategory" :key="group.name">
            <div class="flex items-center gap-4 mb-6">
              <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {{ group.name }}
              </h2>
              <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {{ t('blog.count', { n: group.articles.length }) }}
              </span>
              <div class="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BlogArticleCard
                v-for="article in group.articles"
                :key="article.path"
                :article="article"
              />
            </div>
          </section>
        </div>
      </template>

      <!-- Empty State -->
      <div v-else class="text-center py-20 bg-white/40 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl backdrop-blur-sm">
        <p class="text-zinc-500 dark:text-zinc-400 text-lg font-medium">
          {{ t('adminGate.empty') }}
        </p>
      </div>
    </template>
  </div>
</template>
