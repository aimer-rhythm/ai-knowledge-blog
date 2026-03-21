<script setup lang="ts">
const { t } = useI18n()
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const navLinks = computed(() => [
  { label: t('nav.home'), to: '/' },
  { label: t('nav.categories'), to: '/categories' },
  { label: t('nav.tags'), to: '/tags' },
  { label: t('nav.archives'), to: '/archives' },
  { label: t('nav.private'), to: '/private' },
  { label: t('nav.about'), to: '/about' },
])

const searchDialog = ref<{ open: () => void } | null>(null)

function openSearch() {
  searchDialog.value?.open()
}

function handleScroll() {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(isMobileMenuOpen, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

const route = useRoute()
watch(() => route.fullPath, () => {
  isMobileMenuOpen.value = false
})
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
    :class="[
      isScrolled
        ? 'bg-white/60 dark:bg-zinc-950/60 backdrop-blur-2xl border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]'
        : 'bg-transparent',
    ]"
  >
    <nav class="container-content flex items-center justify-between h-16 md:h-20">
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="flex items-center gap-2.5 group"
      >
        <div class="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 group-hover:scale-105 transition-transform duration-300">
          <svg
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span class="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{{ t('hero.title') }}</span>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-1 bg-zinc-100/50 dark:bg-zinc-800/50 p-1 rounded-xl">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="px-4 py-1.5 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-200"
          active-class="!text-zinc-900 dark:!text-zinc-100 bg-white dark:bg-zinc-900 shadow-sm"
        >
          {{ link.label }}
        </NuxtLink>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-2">
        <!-- Search Button -->
        <button
          type="button"
          class="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
          @click="openSearch"
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
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>

        <div class="hidden sm:block h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

        <UiLanguageSwitcher class="hidden sm:flex" />

        <UiThemeToggle />

        <!-- Mobile Menu Button -->
        <button
          type="button"
          class="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <svg
            v-if="!isMobileMenuOpen"
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <svg
            v-else
            class="w-5 h-5"
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
    </nav>

    <!-- Mobile Menu Dropdown -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden border-t border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 shadow-xl"
      >
        <div class="container-content py-6 space-y-4">
          <div class="flex flex-col gap-2">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="block px-4 py-2.5 rounded-xl text-base font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
              active-class="!text-zinc-900 dark:!text-zinc-100 !bg-zinc-100 dark:!bg-zinc-800"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
          <div class="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between px-4">
            <span class="text-sm text-zinc-500">{{ t('nav.about') }}</span>
            <UiLanguageSwitcher />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Search Dialog -->
    <UiSearchDialog ref="searchDialog" />
  </header>

  <!-- Spacer for fixed header -->
  <div class="h-16 md:h-20" />
</template>
