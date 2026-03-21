<script setup lang="ts">
const props = defineProps<{
  title: string
  category?: string
  image?: string
}>()

const colors = [
  'from-blue-500/20 to-indigo-500/20',
  'from-purple-500/20 to-pink-500/20',
  'from-emerald-500/20 to-teal-500/20',
  'from-orange-500/20 to-rose-500/20',
  'from-cyan-500/20 to-sky-500/20',
  'from-violet-500/20 to-purple-500/20',
]

const iconColors = [
  'text-blue-500',
  'text-purple-500',
  'text-emerald-500',
  'text-orange-500',
  'text-cyan-500',
  'text-violet-500',
]

function getHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

const hash = computed(() => getHash(props.category || props.title))
const bgColor = computed(() => colors[hash.value % colors.length])
const iconColor = computed(() => iconColors[hash.value % iconColors.length])

// Category-based Icon selection
const iconType = computed(() => {
  const cat = props.category?.toLowerCase() || ''
  if (cat.includes('llm') || cat.includes('language') || cat.includes('nlp')) return 'chat'
  if (cat.includes('vision') || cat.includes('image') || cat.includes('cv')) return 'image'
  if (cat.includes('audio') || cat.includes('voice')) return 'audio'
  if (cat.includes('tool')) return 'tool'
  if (cat.includes('prompt')) return 'sparkles'
  if (cat.includes('math') || cat.includes('science')) return 'math'
  return 'code'
})
</script>

<template>
  <div class="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center">
    <!-- Real Image -->
    <NuxtImg
      v-if="image"
      :src="image"
      :alt="title"
      class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
      width="800"
      height="450"
    />

    <!-- Dynamic Placeholder -->
    <template v-else>
      <div class="absolute inset-0 bg-gradient-to-br transition-colors duration-500" :class="bgColor" />
      
      <!-- Abstract Shapes -->
      <div class="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div 
          class="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full blur-3xl bg-current transition-colors duration-500" 
          :class="iconColor" 
        />
        <div 
          class="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full blur-3xl bg-current transition-colors duration-500" 
          :class="iconColor" 
        />
      </div>

      <!-- Icon -->
      <div class="relative z-10 transition-transform duration-500 group-hover:scale-110" :class="iconColor">
        <!-- Chat/NLP -->
        <svg v-if="iconType === 'chat'" class="w-16 h-16 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <!-- Vision -->
        <svg v-else-if="iconType === 'image'" class="w-16 h-16 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
        </svg>
        <!-- Audio -->
        <svg v-else-if="iconType === 'audio'" class="w-16 h-16 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
        <!-- Tools -->
        <svg v-else-if="iconType === 'tool'" class="w-16 h-16 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
        <!-- Prompt/Sparkles -->
        <svg v-else-if="iconType === 'sparkles'" class="w-16 h-16 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
        </svg>
        <!-- Math -->
        <svg v-else-if="iconType === 'math'" class="w-16 h-16 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
        <!-- Default/Code -->
        <svg v-else class="w-16 h-16 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
        </svg>
      </div>
    </template>

    <!-- Overlay Gradient for text readability (if image exists) -->
    <div v-if="image" class="absolute inset-0 bg-gradient-to-t from-zinc-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <!-- Category Badge (Always on top) -->
    <div 
      v-if="category"
      class="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 shadow-sm z-20 border border-zinc-200/50 dark:border-zinc-800/50"
    >
      {{ category }}
    </div>
  </div>
</template>
