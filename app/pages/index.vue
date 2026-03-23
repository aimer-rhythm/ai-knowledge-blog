<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const currentPage = computed(() => Number(route.query.page) || 1)

const articlesData = useArticles({
  page: currentPage,
  perPage: 9,
})

const { isUnlocked } = usePrivateAuth()
const categoriesData = useCategories()

// Defensive translation helper
const safeT = (key: string, fallback: string) => {
  if (typeof t !== 'function') return fallback
  try {
    const res = t(key)
    return !res || res === key ? fallback : res
  } catch {
    return fallback
  }
}

// Stats for knowledge card
const stats = computed(() => {
  const count = articlesData?.totalCount?.value || 0
  const catCount = categoriesData?.categories?.value?.length || 0
  const unlocked = isUnlocked?.value
  
  return [
    { label: safeT('nav.archives', 'Archives'), value: count, unit: 'Posts' },
    { label: safeT('categories.title', 'Categories'), value: catCount, unit: 'Topics' },
    { label: 'Status', value: unlocked ? 'Admin' : 'Public', unit: 'Access' },
  ]
})

// Current focus keywords - You can edit these anytime
const focusKeywords = [
  'LLM Agents',
  'Prompt Engineering',
  'DeepSeek-V3',
  'Agentic Workflow',
  'RAG Optimization',
]

const activeFocusIndex = ref(0)
let focusInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  focusInterval = setInterval(() => {
    activeFocusIndex.value = (activeFocusIndex.value + 1) % focusKeywords.length
  }, 3000)
})

onUnmounted(() => {
  if (focusInterval) clearInterval(focusInterval)
})

async function goToRandomArticle() {
  try {
    const allPaths = await queryCollection('content')
      .select('path', 'private')
      .all()
      .then(res => res.filter(r => isUnlocked.value || !isPrivateArticle(r as any)).map(r => r.path))
    
    if (allPaths.length > 0) {
      const randomPath = allPaths[Math.floor(Math.random() * allPaths.length)]
      if (randomPath) {
        router.push(randomPath)
      }
    }
  } catch (error) {
    console.error('Failed to get random article:', error)
  }
}

function onPageChange(page: number) {
  router.push({ query: { ...route.query, page: page > 1 ? page : undefined } })
}

useHead({
  title: `${safeT('hero.title', 'AI KB')} - ${safeT('hero.subtitle', 'Blog')}`,
  meta: [
    { name: 'description', content: safeT('footer.description', 'AI Knowledge Base') },
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
        <!-- Cyber Focus Status Pill -->
        <div class="mb-8 flex justify-center">
          <div class="group relative px-4 py-2 rounded-full bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm transition-all duration-500 hover:border-primary-500/30">
            <!-- Animated Glowing Border -->
            <div class="absolute -inset-px rounded-full bg-gradient-to-r from-primary-500/0 via-primary-500/20 to-primary-500/0 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-700 animate-pulse" />
            
            <div class="relative flex items-center gap-3">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-primary-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
              </span>
              
              <span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] border-r border-zinc-200 dark:border-zinc-800 pr-3 mr-1">
                {{ safeT('hero.focus', 'Focus') }}
              </span>

              <div class="h-5 flex items-center justify-center min-w-[100px] transition-all duration-500">
                <Transition
                  mode="out-in"
                  enter-active-class="transition duration-300 ease-out"
                  enter-from-class="opacity-0 translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition duration-200 ease-in"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 -translate-y-2"
                >
                  <span
                    :key="activeFocusIndex"
                    class="whitespace-nowrap text-[11px] font-mono font-bold text-zinc-600 dark:text-zinc-300 tracking-tight"
                  >
                    # {{ focusKeywords[activeFocusIndex] }}<span class="animate-pulse ml-0.5">_</span>
                  </span>
                </Transition>
              </div>
            </div>
          </div>
        </div>

        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 via-primary-700 to-primary-600 dark:from-zinc-100 dark:via-primary-300 dark:to-primary-400 bg-clip-text text-transparent">
          {{ t('hero.title') }}
        </h1>
        <p class="mt-6 text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          {{ t('hero.subtitle') }}
        </p>

        <!-- Dynamic Stats Grid -->
        <div class="mt-8 flex justify-center gap-3 sm:gap-6">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="group p-3 sm:px-6 sm:py-3 rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 transition-all hover:border-primary-500/20"
          >
            <div class="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
              <span class="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tabular-nums">
                {{ stat.value }}
              </span>
              <div class="flex flex-col text-left">
                <span class="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-tighter">{{ stat.label }}</span>
                <span class="text-[10px] font-semibold text-primary-500/80">{{ stat.unit }}</span>
              </div>
            </div>
          </div>
        </div>

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
          <button
            type="button"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-semibold hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all duration-300 group"
            @click="goToRandomArticle"
          >
            <svg
              class="w-4 h-4 group-hover:rotate-[360deg] transition-transform duration-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="4" ry="4" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <circle cx="15.5" cy="15.5" r="1.5" />
              <circle cx="15.5" cy="8.5" r="1.5" />
              <circle cx="8.5" cy="15.5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
            </svg>
            {{ t('hero.surprise') }}
          </button>
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
      <div v-if="articlesData.pending.value" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <div v-else-if="articlesData.articles.value?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        <BlogArticleCard
          v-for="article in articlesData.articles.value"
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
      <div v-if="articlesData.totalPages.value > 1" class="mt-16 flex justify-center">
        <BlogPagination
          :current-page="currentPage"
          :total-pages="articlesData.totalPages.value"
          @update:current-page="onPageChange"
        />
      </div>
    </section>
  </div>
</template>
