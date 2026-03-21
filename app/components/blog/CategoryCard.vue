<script setup lang="ts">
const { t } = useI18n()

const props = defineProps<{
  name: string
  count: number
  description?: string
  image?: string
}>()

// Category-based Icon selection
const iconType = computed(() => {
  const cat = props.name.toLowerCase()
  if (cat.includes('llm') || cat.includes('语言') || cat.includes('nlp')) return 'chat'
  if (cat.includes('视觉') || cat.includes('图像') || cat.includes('cv')) return 'image'
  if (cat.includes('音频') || cat.includes('声音')) return 'audio'
  if (cat.includes('工具')) return 'tool'
  if (cat.includes('提示') || cat.includes('prompt')) return 'sparkles'
  if (cat.includes('数学') || cat.includes('数据')) return 'math'
  return 'code'
})

const accentColors = [
  'from-blue-500 to-blue-600',
  'from-emerald-500 to-emerald-600',
  'from-violet-500 to-violet-600',
  'from-amber-500 to-amber-600',
  'from-rose-500 to-rose-600',
  'from-cyan-500 to-cyan-600',
  'from-indigo-500 to-indigo-600',
  'from-teal-500 to-teal-600',
]

function getAccentColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return accentColors[Math.abs(hash) % accentColors.length] ?? accentColors[0]!
}
</script>

<template>
  <NuxtLink
    :to="`/categories/${name}`"
    class="group relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/50 backdrop-blur-sm p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800/60 dark:bg-zinc-900/50"
  >
    <!-- Background Gradient Glow -->
    <div class="absolute -inset-px opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br" :class="getAccentColor(name)" />

    <!-- Colored accent bar -->
    <div
      class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r transition-all duration-300 group-hover:h-1.5 opacity-80 group-hover:opacity-100"
      :class="getAccentColor(name)"
    />

    <div class="relative flex items-start gap-4">
      <!-- Icon/Image -->
      <div
        class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10 overflow-hidden"
        :class="getAccentColor(name)"
      >
        <NuxtImg
          v-if="image"
          :src="image"
          :alt="name"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <template v-else>
          <!-- Chat/NLP -->
          <svg v-if="iconType === 'chat'" class="w-7 h-7 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <!-- Vision -->
          <svg v-else-if="iconType === 'image'" class="w-7 h-7 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
          <!-- Audio -->
          <svg v-else-if="iconType === 'audio'" class="w-7 h-7 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
          <!-- Tools -->
          <svg v-else-if="iconType === 'tool'" class="w-7 h-7 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
          <!-- Prompt/Sparkles -->
          <svg v-else-if="iconType === 'sparkles'" class="w-7 h-7 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          </svg>
          <!-- Math -->
          <svg v-else-if="iconType === 'math'" class="w-7 h-7 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
          <!-- Default/Code -->
          <svg v-else class="w-7 h-7 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
        </template>
      </div>

      <div class="min-w-0 flex-1">
        <!-- Name -->
        <h3
          class="text-base font-bold text-zinc-900 transition-colors group-hover:text-primary-600 dark:text-zinc-100 dark:group-hover:text-primary-400"
        >
          {{ name }}
        </h3>

        <!-- Description -->
        <p
          v-if="description"
          class="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"
        >
          {{ description }}
        </p>

        <!-- Count -->
        <span class="mt-3 inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          {{ t('blog.count', { n: count }) }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
