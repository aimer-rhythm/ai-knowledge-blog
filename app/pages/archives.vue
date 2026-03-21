<script setup lang="ts">
import { compareContentDatesDesc, parseContentDate } from '~/utils/content'

const { t } = useI18n()
const { isUnlocked } = usePrivateAuth()

const { data: allArticles, pending } = await useAsyncData(`archives-${toValue(isUnlocked)}`, () =>
  queryCollection('content')
    .select('title', 'path', 'date', 'description', 'category', 'private')
    .all()
    .then(results => results.filter(r => isUnlocked.value || !(r as any).private).sort(compareContentDatesDesc)),
)

// Group articles by year and month
const groups = computed(() => {
  if (!allArticles.value?.length) return []

  const yearMap = new Map<number, Map<number, any>>()

  for (const article of allArticles.value) {
    const d = parseContentDate(article.date)
    if (!d) continue
    const year = d.getFullYear()
    const month = d.getMonth() + 1

    if (!yearMap.has(year)) yearMap.set(year, new Map())
    const monthMap = yearMap.get(year)!
    if (!monthMap.has(month)) monthMap.set(month, [])
    monthMap.get(month)!.push(article)
  }

  const result: any[] = []

  for (const [year, monthMap] of [...yearMap.entries()].sort((a, b) => b[0] - a[0])) {
    const months: any[] = []
    for (const [month, articles] of [...monthMap.entries()].sort((a, b) => b[0] - a[0])) {
      months.push({ month, articles })
    }
    result.push({ year, months })
  }

  return result
})

const totalCount = computed(() => allArticles.value?.length ?? 0)

useHead({
  title: `${t('nav.archives')} - ${t('hero.title')}`,
  meta: [
    { name: 'description', content: t('footer.description') },
  ],
})
</script>

<template>
  <div class="container-content py-10 lg:py-16">
    <header class="mb-12">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
        {{ t('nav.archives') }}
      </h1>
      <p class="mt-4 inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
        {{ t('archives.count', { n: totalCount }) }}
      </p>
    </header>

    <!-- Loading -->
    <div v-if="pending" class="space-y-12">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="h-10 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-xl w-32 mb-8" />
        <div class="space-y-6 pl-8 border-l border-zinc-200/50 dark:border-zinc-800/50">
          <div v-for="j in 3" :key="j" class="h-8 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-xl w-full max-w-2xl" />
        </div>
      </div>
    </div>

    <!-- Timeline -->
    <BlogTimeline v-else-if="groups.length" :groups="groups" />

    <!-- Empty State -->
    <div v-else class="text-center py-20 bg-white/40 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl backdrop-blur-sm">
      <p class="text-zinc-500 dark:text-zinc-400 text-lg font-medium">
        {{ t('blog.empty') }}
      </p>
    </div>
  </div>
</template>
