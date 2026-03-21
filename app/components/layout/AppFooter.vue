<script setup lang="ts">
const { t } = useI18n()
const currentYear = new Date().getFullYear()

const links = computed(() => [
  { label: t('nav.home'), to: '/' },
  { label: t('nav.categories'), to: '/categories' },
  { label: t('nav.tags'), to: '/tags' },
  { label: t('nav.archives'), to: '/archives' },
  { label: t('nav.about'), to: '/about' },
])
</script>

<template>
  <footer class="relative mt-20 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white/30 dark:bg-zinc-950/30 backdrop-blur-2xl transition-colors duration-500 overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-50"></div>
    <div class="container-content relative py-12 md:py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <!-- Brand -->
        <div class="lg:col-span-2">
          <NuxtLink to="/" class="flex items-center gap-2.5 mb-6 group">
            <div class="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 group-hover:scale-105 shadow-md group-hover:shadow-lg transition-all duration-300">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span class="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{{ t('hero.title') }}</span>
          </NuxtLink>
          <p class="text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
            {{ t('footer.description') }}
          </p>
        </div>

        <!-- Links -->
        <div>
          <h3 class="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6">
            {{ t('footer.links') }}
          </h3>
          <ul class="space-y-3.5">
            <li v-for="link in links" :key="link.to">
              <NuxtLink 
                :to="link.to" 
                class="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Social -->
        <div>
          <h3 class="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6">
            {{ t('footer.social') }}
          </h3>
          <div class="flex gap-3">
            <a href="#" class="w-11 h-11 flex items-center justify-center rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:scale-105 shadow-sm hover:shadow transition-all duration-300">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div class="mt-16 pt-8 border-t border-zinc-200/50 dark:border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-sm font-medium text-zinc-500 dark:text-zinc-500">
          {{ t('footer.copyright', { year: currentYear }) }}
        </p>
        <div class="flex items-center gap-6">
          <a href="/rss.xml" class="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">RSS</a>
          <a href="/sitemap_index.xml" class="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Sitemap</a>
        </div>
      </div>
    </div>
  </footer>
</template>
