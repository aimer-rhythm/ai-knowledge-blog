<script setup lang="ts">
import { formatContentDate } from '~/utils/content'

const { t, locale } = useI18n()
const localeCode = computed(() => unref(locale))

interface Article {
  path: string
  title: string
  date: string
}

interface MonthGroup {
  month: number
  articles: Article[]
}

interface YearGroup {
  year: number
  months: MonthGroup[]
}

defineProps<{
  groups: YearGroup[]
}>()

function formatDay(dateStr: string): string {
  return formatContentDate(dateStr, localeCode.value, {
    month: 'numeric',
    day: 'numeric',
  })
}

function monthName(month: number): string {
  const d = new Date(2000, month - 1, 1)
  return d.toLocaleDateString(locale.value === 'zh' ? 'zh-CN' : 'en-US', {
    month: 'long',
  })
}
</script>

<template>
  <div class="relative pl-12 sm:pl-16">
    <!-- Timeline line -->
    <div
      class="absolute left-4 sm:left-6 top-3 bottom-0 w-[2px] bg-zinc-200 dark:bg-zinc-800"
    />

    <div v-for="group in groups" :key="group.year" class="relative mb-20 last:mb-0">
      <!-- Year marker -->
      <div class="absolute left-[-15px] sm:left-[-39px] top-1.5 w-px flex justify-center items-center">
        <div class="z-10 w-4 h-4 shrink-0 rounded-full bg-zinc-900 dark:bg-zinc-100 ring-4 ring-white dark:ring-zinc-950 shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
      </div>
      
      <h2 class="text-4xl font-black text-zinc-900 dark:text-zinc-100 mb-12 tracking-tighter">
        {{ group.year }}
      </h2>

      <!-- Month sections -->
      <div
        v-for="monthGroup in group.months"
        :key="`${group.year}-${monthGroup.month}`"
        class="relative mb-10 last:mb-0"
      >
        <!-- Month label -->
        <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mb-6 flex items-center gap-4">
          {{ monthName(monthGroup.month) }}
          <div class="h-px flex-1 bg-zinc-200/50 dark:bg-zinc-800/50" />
        </h3>

        <!-- Articles list -->
        <ul class="space-y-4">
          <li
            v-for="article in monthGroup.articles"
            :key="article.path"
            class="group"
          >
            <NuxtLink
              :to="article.path"
              class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 px-4 py-3 -ml-4 rounded-xl hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition-all duration-300"
            >
              <time
                :datetime="article.date"
                class="shrink-0 text-xs font-semibold tabular-nums text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors"
              >
                {{ formatDay(article.date) }}
              </time>
              <span
                class="text-base font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
              >
                {{ article.title }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
