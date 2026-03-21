<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: `${t('nav.about')} - ${t('hero.title')}`,
  meta: [
    { name: 'description', content: t('footer.description') },
  ],
})

const techStack = [
  { name: 'Nuxt 3', description: 'Vue framework with SSR/SSG', url: 'https://nuxt.com' },
  { name: 'Vue 3', description: 'Progressive JavaScript Framework', url: 'https://vuejs.org' },
  { name: 'Tailwind CSS', description: 'Utility-first CSS framework', url: 'https://tailwindcss.com' },
  { name: '@nuxt/content', description: 'Markdown-based CMS for Nuxt', url: 'https://content.nuxt.com' },
  { name: 'KaTeX', description: 'Math typesetting engine', url: 'https://katex.org' },
  { name: 'Vercel', description: 'Deployment and hosting', url: 'https://vercel.com' },
]

const links = [
  { name: 'GitHub', url: '#', icon: 'github' },
  { name: 'Email', url: 'mailto:contact@example.com', icon: 'email' },
]
</script>

<template>
  <div class="container-content py-10 lg:py-16">
    <header class="mb-16">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
        {{ t('about.title') }}
      </h1>
      <p class="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
        {{ t('about.intro') }}
      </p>
    </header>

    <div class="space-y-16">
      <!-- Introduction -->
      <section class="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
        <div class="prose prose-lg dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <p>{{ t('about.introText1') }}</p>
          <p>{{ t('about.introText2') }}</p>
          <p>{{ t('about.introText3') }}</p>
        </div>
      </section>

      <!-- Tech Stack -->
      <section>
        <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 flex items-center gap-3">
          <span class="w-2 h-2 rounded-full bg-primary-500" />
          {{ t('about.techStack') }}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <a
            v-for="tech in techStack"
            :key="tech.name"
            :href="tech.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group p-6 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-800/60 hover:border-primary-500/50 dark:hover:border-primary-500/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div class="font-bold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-2 transition-colors">
              {{ tech.name }}
            </div>
            <div class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {{ tech.description }}
            </div>
          </a>
        </div>
      </section>

      <!-- Contact / Links -->
      <section class="bg-zinc-900/5 dark:bg-zinc-100/5 rounded-3xl p-8 sm:p-12 border border-zinc-200/20 dark:border-zinc-800/20">
        <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          {{ t('about.contact') }}
        </h2>
        <p class="text-zinc-600 dark:text-zinc-400 mb-8 text-lg">
          {{ t('about.contactText') }}
        </p>
        <div class="flex flex-wrap gap-4">
          <a
            v-for="link in links"
            :key="link.name"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-bold hover:scale-105 transition-all duration-300 shadow-md"
          >
            {{ link.name }}
          </a>
        </div>
      </section>

      <!-- License -->
      <section class="pb-12 border-t border-zinc-200/50 dark:border-zinc-800/50 pt-12">
        <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          {{ t('about.license') }}
        </h2>
        <p class="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-2xl">
          {{ t('about.licenseText', { license: 'CC BY-NC-SA 4.0' }) }}
        </p>
      </section>
    </div>
  </div>
</template>
