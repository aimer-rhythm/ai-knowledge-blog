<script setup lang="ts">
import { compareContentDatesDesc, isPrivateArticle } from '~/utils/content'

const { t } = useI18n()
const { isUnlocked } = usePrivateAuth()

interface ReadingNavArticle {
  path: string
  title: string
  date: string
  category?: string
}

definePageMeta({
  layout: false,
  key: route => route.path,
})

const route = useRoute()
const decodedRoutePath = computed(() => decodeURI(route.path))

const { data: article, status } = await useAsyncData(`article-${route.path}-${toValue(isUnlocked)}`, async () => {
  const result = await queryCollection('content').path(decodedRoutePath.value).first()
  if (!result) return null

  const { password, ...safeResult } = result as any

  // Strip body for private articles when not authenticated
  if (isPrivateArticle(safeResult) && !isUnlocked.value) {
    const { body, ...withoutBody } = safeResult
    return withoutBody
  }

  return safeResult
})

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: t('blog.notFound'),
  })
}

const isPrivate = computed(() => isPrivateArticle(article.value as any))

// Query previous and next articles by date (conditional filtering)
const { data: prevNext } = await useAsyncData(`prev-next-${route.path}-${toValue(isUnlocked)}`, async () => {
  const articles = await queryCollection('content')
    .select('path', 'title', 'date', 'private')
    .all()
    .then(results => results.filter(r => isUnlocked.value || !isPrivateArticle(r as any)).sort(compareContentDatesDesc))
    .catch(() => [])

  const currentIndex = articles.findIndex(item => item.path === decodedRoutePath.value)

  return {
    prev: currentIndex >= 0 ? articles[currentIndex + 1] ?? null : null,
    next: currentIndex > 0 ? articles[currentIndex - 1] ?? null : null,
  }
})

// Query related articles (same category, exclude current, conditional filtering)
const { data: relatedArticles } = await useAsyncData(`related-${route.path}-${toValue(isUnlocked)}`, async () => {
  if (!article.value?.category) return []

  const results = await queryCollection('content')
    .where('category', '=', article.value.category)
    .where('path', '<>', decodedRoutePath.value)
    .select('path', 'title', 'description', 'image', 'date', 'category', 'tags', 'private')
    .all()
    .catch(() => [])

  return results.filter(r => isUnlocked.value || !isPrivateArticle(r as any)).sort(compareContentDatesDesc).slice(0, 3)
})

const { data: readingNavArticles } = await useAsyncData(`reading-nav-${route.path}-${toValue(isUnlocked)}`, () =>
  queryCollection('content')
    .select('path', 'title', 'date', 'category', 'private')
    .all()
    .then(results => results.filter(r => isUnlocked.value || !isPrivateArticle(r as any)).sort(compareContentDatesDesc) as ReadingNavArticle[])
    .catch(() => [] as ReadingNavArticle[]),
)

const readingNavGroups = computed(() => {
  const groupsMap = new Map<string, {
    key: string
    name?: string
    count: number
    latestDate: string
    isCurrent: boolean
    articles: ReadingNavArticle[]
  }>()

  const currentCategoryKey = article.value?.category?.trim() || '__uncategorized__'

  for (const item of readingNavArticles.value ?? []) {
    const categoryName = item.category?.trim()
    const categoryKey = categoryName || '__uncategorized__'
    const current = groupsMap.get(categoryKey) ?? {
      key: categoryKey,
      name: categoryName,
      count: 0,
      latestDate: item.date,
      isCurrent: categoryKey === currentCategoryKey,
      articles: [],
    }

    current.count += 1
    current.articles.push(item)
    if (compareContentDatesDesc({ date: item.date }, { date: current.latestDate }) < 0) {
      current.latestDate = item.date
    }

    groupsMap.set(categoryKey, current)
  }

  return [...groupsMap.values()].sort((a, b) => {
    if (a.isCurrent !== b.isCurrent) return a.isCurrent ? -1 : 1
    if (a.count !== b.count) return b.count - a.count
    return compareContentDatesDesc({ date: a.latestDate }, { date: b.latestDate })
  })
})

// SEO
useHead({
  title: () => article.value?.title ?? t('blog.notFound'),
  meta: () => isPrivate.value
    ? [{ name: 'robots', content: 'noindex, nofollow' }]
    : [],
})

useSeoMeta({
  title: () => article.value?.title ?? t('blog.notFound'),
  description: () => article.value?.description,
  ogTitle: () => article.value?.title ?? t('blog.notFound'),
  ogDescription: () => article.value?.description,
  ogType: 'article',
  articlePublishedTime: () => article.value?.date,
  articleSection: () => article.value?.category,
})
</script>

<template>
  <NuxtLayout name="article">
    <div v-if="article">
      <!-- Admin Gate for private articles -->
      <BlogAdminGate
        v-if="isPrivate && !isUnlocked"
      />

      <!-- Article content (shown when not private or unlocked) -->
      <template v-else>
        <header class="mb-10 pb-8 border-b border-zinc-200 dark:border-zinc-800">
          <div class="mb-4">
            <BlogArticleMeta :article="article" />
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 leading-tight tracking-tight">
            {{ article.title }}
          </h1>
          <p
            v-if="article.description"
            class="mt-5 text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed border-l-4 border-primary-500 pl-4 py-1 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-r-lg"
          >
            {{ article.description }}
          </p>
        </header>

        <div class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:font-medium prose-img:rounded-2xl">
          <ContentRenderer :key="article.path" :value="article" />
        </div>

        <div v-if="article.tags?.length" class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <BlogTagList :tags="article.tags" size="md" />
        </div>

        <div class="mt-8">
          <BlogPrevNextNav
            :prev="prevNext?.prev ?? null"
            :next="prevNext?.next ?? null"
          />
        </div>

        <div v-if="relatedArticles?.length" class="mt-12">
          <BlogRelatedArticles :articles="relatedArticles" />
        </div>
      </template>
    </div>

    <template #sidebar>
      <BlogTableOfContents
        v-if="article?.body?.toc?.links?.length && (!isPrivate || isUnlocked)"
        :links="article.body.toc.links"
      />
    </template>

    <template #navigation>
      <BlogReadingNavigator
        v-if="!isPrivate || isUnlocked"
        :groups="readingNavGroups"
        :current-path="article?.path ?? decodedRoutePath"
      />
    </template>
  </NuxtLayout>
</template>
