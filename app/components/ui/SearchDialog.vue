<script setup lang="ts">
import { compareContentDatesDesc, isPrivateArticle } from '~/utils/content'

const { t } = useI18n()

const isOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

interface SearchResult {
  path: string
  title: string
  description?: string
  category?: string
  date?: string
}

const { isUnlocked } = usePrivateAuth()
const searchResults = ref<SearchResult[]>([])
const isSearching = ref(false)
const highlightedIndex = ref(-1)

function open() {
  isOpen.value = true
  searchQuery.value = ''
  searchResults.value = []
  highlightedIndex.value = -1
  nextTick(() => {
    searchInput.value?.focus()
  })
}

function close() {
  isOpen.value = false
  searchQuery.value = ''
  searchResults.value = []
  highlightedIndex.value = -1
}

defineExpose({ open, close })

function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    if (isOpen.value) {
      close()
    } else {
      open()
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

watch(isOpen, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

watch(searchResults, (results) => {
  highlightedIndex.value = results.length ? 0 : -1
})

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout> | null = null

watch(searchQuery, (query) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  if (!query.trim()) {
    searchResults.value = []
    isSearching.value = false
    highlightedIndex.value = -1
    return
  }
  isSearching.value = true
  searchTimeout = setTimeout(async () => {
    try {
      const results = await queryCollection('content')
        .where('title', 'LIKE', `%${query}%`)
        .all()
      searchResults.value = (results as unknown as (SearchResult & { private?: boolean })[])
        .filter(r => isUnlocked.value || !isPrivateArticle(r as any))
        .sort(compareContentDatesDesc)
        .slice(0, 10)
    } catch {
      searchResults.value = []
    }
    isSearching.value = false
  }, 300)
})

const router = useRouter()

function goToResult(path: string) {
  close()
  router.push(path)
}

function moveSelection(step: number) {
  if (!searchResults.value.length) return

  highlightedIndex.value =
    (highlightedIndex.value + step + searchResults.value.length) % searchResults.value.length
}

function selectHighlightedResult() {
  const selected = searchResults.value[highlightedIndex.value]
  if (selected) {
    goToResult(selected.path)
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-zinc-900/40 dark:bg-black/40 backdrop-blur-md"
          @click="close"
        />

        <!-- Dialog -->
        <Transition
          appear
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="isOpen"
            class="relative w-full max-w-lg bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-zinc-900/10 dark:shadow-black/40 border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden"
            @keydown.escape="close"
          >
            <!-- Search Input -->
            <div class="flex items-center border-b border-zinc-200/60 dark:border-zinc-800/60">
              <svg
                class="w-5 h-5 ml-4 text-zinc-400 dark:text-zinc-500 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref="searchInput"
                v-model="searchQuery"
                type="text"
                :placeholder="t('search.placeholder')"
                class="flex-1 px-3 py-4 text-sm bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none"
                @keydown.down.prevent="moveSelection(1)"
                @keydown.up.prevent="moveSelection(-1)"
                @keydown.enter.prevent="selectHighlightedResult"
                @keydown.escape="close"
              >
              <kbd
                class="mr-3 px-1.5 py-0.5 text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md shrink-0"
              >
                ESC
              </kbd>
            </div>

            <!-- Results Area -->
            <div class="max-h-[60vh] overflow-y-auto p-2">
              <div
                v-if="!searchQuery"
                class="flex flex-col items-center justify-center py-12 text-zinc-400 dark:text-zinc-500"
              >
                <svg
                  class="w-10 h-10 mb-3 opacity-30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <p class="text-sm font-medium">{{ t('search.start') }}</p>
              </div>

              <!-- Loading -->
              <div
                v-else-if="isSearching"
                class="flex flex-col items-center justify-center py-12 text-zinc-400 dark:text-zinc-500"
              >
                <div class="w-6 h-6 border-2 border-zinc-200 dark:border-zinc-700 border-t-primary-500 dark:border-t-primary-500 rounded-full animate-spin mb-3" />
                <p class="text-sm font-medium">{{ t('search.searching') }}</p>
              </div>

              <!-- Results -->
              <div v-else-if="searchResults.length" class="space-y-1">
                <button
                  v-for="(result, index) in searchResults"
                  :key="result.path"
                  class="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-colors"
                  :class="index === highlightedIndex ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'"
                  @mouseenter="highlightedIndex = index"
                  @click="goToResult(result.path)"
                >
                  <svg
                    class="w-4 h-4 mt-0.5 shrink-0 transition-colors"
                    :class="index === highlightedIndex ? 'text-primary-500' : 'text-zinc-400'"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                    <polyline points="13 2 13 9 20 9" />
                  </svg>
                  <div class="min-w-0">
                    <div class="text-sm font-medium transition-colors truncate" :class="index === highlightedIndex ? 'text-primary-700 dark:text-primary-400' : 'text-zinc-900 dark:text-zinc-100'">
                      {{ result.title }}
                    </div>
                    <div v-if="result.description" class="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                      {{ result.description }}
                    </div>
                  </div>
                  <span
                    v-if="result.category"
                    class="ml-auto shrink-0 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full"
                    :class="index === highlightedIndex ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'"
                  >
                    {{ result.category }}
                  </span>
                </button>
              </div>

              <!-- No results -->
              <div
                v-else-if="searchQuery"
                class="flex flex-col items-center justify-center py-12 text-zinc-400 dark:text-zinc-500"
              >
                <p class="text-sm font-medium">{{ t('search.noResults', { query: searchQuery }) }}</p>
              </div>
            </div>

            <!-- Footer -->
            <div
              class="flex items-center justify-between px-4 py-3 border-t border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/30 text-[11px] font-medium text-zinc-400 dark:text-zinc-500"
            >
              <div class="flex items-center gap-4">
                <span class="flex items-center gap-1.5">
                  <kbd
                    class="px-1.5 py-0.5 font-mono font-bold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md"
                  >&uarr;</kbd>
                  <kbd
                    class="px-1.5 py-0.5 font-mono font-bold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md"
                  >&darr;</kbd>
                  {{ t('search.navigate') }}
                </span>
                <span class="flex items-center gap-1.5">
                  <kbd
                    class="px-1.5 py-0.5 font-mono font-bold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md"
                  >&crarr;</kbd>
                  {{ t('search.open') }}
                </span>
              </div>
              <span class="flex items-center gap-1.5">
                <kbd
                  class="px-1.5 py-0.5 font-mono font-bold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md"
                >ESC</kbd>
                {{ t('search.close') }}
              </span>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
