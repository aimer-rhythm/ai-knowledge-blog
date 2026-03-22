<script setup lang="ts">
const { t } = useI18n()

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  code?: string
  language?: string
  filename?: string
  highlights?: number[]
}>()

const attrs = useAttrs()

const copied = ref(false)
const isExpanded = ref(false)

async function copyCode() {
  const text = props.code || ''
  if (!text) return

  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

function toggleExpand() {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isExpanded.value) {
    toggleExpand()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  if (isExpanded.value) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div class="code-block group relative my-6">
    <!-- Language badge + Toolbar -->
    <div class="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pt-3">
      <span
        v-if="props.language"
        class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 select-none"
      >
        {{ props.filename || props.language }}
      </span>
      <span v-else />

      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <!-- Copy button -->
        <button
          :title="t('code.copy')"
          class="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 transition-all duration-200"
          @click="copyCode"
        >
          <!-- Check icon (copied) -->
          <svg
            v-if="copied"
            class="w-4 h-4 text-emerald-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <!-- Copy icon -->
          <svg
            v-else
            class="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>

        <!-- Expand button -->
        <button
          :title="t('code.expand')"
          class="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 transition-all duration-200"
          @click="toggleExpand"
        >
          <svg
            class="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Code block: $attrs (Shiki classes + style) bound to <pre> -->
    <pre v-bind="attrs" class="!pt-12"><slot /></pre>

    <!-- Fullscreen Modal -->
    <Teleport to="body">
      <Transition name="code-modal">
        <div
          v-if="isExpanded"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          @click.self="toggleExpand"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <!-- Modal content -->
          <div class="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl border border-zinc-200/30 dark:border-zinc-700/50 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden">
            <!-- Modal header -->
            <div class="flex items-center justify-between px-5 py-3 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/80 dark:bg-zinc-900/80">
              <div class="flex items-center gap-3">
                <span
                  v-if="props.language"
                  class="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                >
                  {{ props.filename || props.language }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <button
                  :title="t('code.copy')"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 transition-all duration-200"
                  @click="copyCode"
                >
                  <svg
                    v-if="copied"
                    class="w-3.5 h-3.5 text-emerald-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <svg
                    v-else
                    class="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  {{ copied ? t('code.copied') : t('code.copy') }}
                </button>
                <button
                  :title="t('search.close')"
                  class="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 transition-all duration-200"
                  @click="toggleExpand"
                >
                  <svg
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Modal code -->
            <div class="flex-1 overflow-auto p-5">
              <pre v-bind="attrs" class="!m-0 !border-0 !shadow-none !bg-transparent !p-0"><slot /></pre>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.code-modal-enter-active,
.code-modal-leave-active {
  transition: opacity 0.2s ease;
}

.code-modal-enter-from,
.code-modal-leave-to {
  opacity: 0;
}
</style>
