<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectLocale(code: string) {
  setLocale(code)
  isOpen.value = false
}

// Simple click outside logic
if (import.meta.client) {
  const handleOutsideClick = (e: MouseEvent) => {
    if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
      isOpen.value = false
    }
  }
  onMounted(() => {
    document.addEventListener('click', handleOutsideClick)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handleOutsideClick)
  })
}
</script>

<template>
  <div ref="containerRef" class="relative">
    <button
      type="button"
      class="flex items-center justify-center w-9 h-9 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 transition-all duration-200"
      :class="{ 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100': isOpen }"
      @click="toggleDropdown"
    >
      <svg
        class="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-40 origin-top-right rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 shadow-xl shadow-zinc-900/5 dark:shadow-black/20 p-1.5 z-50"
      >
        <button
          v-for="lang in locales"
          :key="lang.code"
          type="button"
          class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors"
          :class="[
            locale === lang.code
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100'
          ]"
          @click="selectLocale(lang.code)"
        >
          <span>{{ lang.name }}</span>
          <svg
            v-if="locale === lang.code"
            class="w-4 h-4 text-primary-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>
