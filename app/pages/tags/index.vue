<script setup lang="ts">
const { t } = useI18n()
const { tags } = useTags()

// Compute font size range based on tag count
const tagStyles = computed(() => {
  if (!tags.value?.length) return []

  const counts = tags.value.map(t => t.count)
  const minCount = Math.min(...counts)
  const maxCount = Math.max(...counts)
  const range = maxCount - minCount || 1

  return tags.value.map(tag => {
    const ratio = (tag.count - minCount) / range
    const fontSize = 0.875 + ratio * 1.125 // 0.875rem to 2rem
    const opacity = 0.6 + ratio * 0.4 // 60% to 100%
    return {
      ...tag,
      fontSize: `${fontSize}rem`,
      opacity,
    }
  })
})

useHead({
  title: `${t('tags.title')} - ${t('hero.title')}`,
  meta: [
    { name: 'description', content: t('tags.subtitle') },
  ],
})
</script>

<template>
  <div class="container-content py-10 lg:py-16">
    <header class="mb-12">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
        {{ t('tags.title') }}
      </h1>
      <p class="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
        {{ t('tags.subtitle') }}
      </p>
    </header>

    <!-- Loading -->
    <div v-if="!tags" class="flex flex-wrap gap-3">
      <div
        v-for="i in 12"
        :key="i"
        class="animate-pulse h-10 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-full"
        :style="{ width: `${60 + Math.random() * 80}px` }"
      />
    </div>

    <!-- Tag Cloud -->
    <div
      v-else-if="tagStyles.length"
      class="flex flex-wrap items-center gap-3 sm:gap-4 p-8 sm:p-12 rounded-3xl bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm"
    >
      <NuxtLink
        v-for="tag in tagStyles"
        :key="tag.name"
        :to="`/tags/${encodeURIComponent(tag.name)}`"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-zinc-200/60 dark:border-zinc-800/60 hover:border-primary-400/50 dark:hover:border-primary-500/50 bg-white/60 dark:bg-zinc-900/60 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-zinc-700 dark:text-zinc-300 hover:text-primary-600 dark:hover:text-primary-400 hover:scale-105 hover:shadow-sm transition-all duration-300 backdrop-blur-md"
        :style="{ fontSize: tag.fontSize, opacity: tag.opacity }"
      >
        <span class="text-primary-500/70 font-semibold">#</span>
        <span class="font-medium tracking-tight">{{ tag.name }}</span>
        <span class="text-xs font-semibold text-zinc-400/80 dark:text-zinc-500/80 ml-1">{{ tag.count }}</span>
      </NuxtLink>
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-20 bg-white/40 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl backdrop-blur-sm">
      <p class="text-zinc-500 dark:text-zinc-400 text-lg font-medium">
        {{ t('tags.empty') }}
      </p>
    </div>
  </div>
</template>
