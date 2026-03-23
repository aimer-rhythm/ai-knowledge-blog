// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    privateKey: '',
  },

  future: {
    compatibilityVersion: 4,
  },

  routeRules: {
    '/': { prerender: true },
    '/en': { prerender: true },
    '/about': { prerender: true },
    '/en/about': { prerender: true },
    '/archives': { prerender: true },
    '/en/archives': { prerender: true },
    '/categories': { prerender: true },
    '/en/categories': { prerender: true },
    '/tags': { prerender: true },
    '/en/tags': { prerender: true },
    '/private': { prerender: false },
    '/en/private': { prerender: false },
    '/api/**': { prerender: false },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/en'],
      ignore: ['/private', '/en/private'],
    },
  },

  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/image',
    '@nuxtjs/sitemap',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
  ],

  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'zh', name: '简体中文', file: 'zh-CN.json' },
    ],
    defaultLocale: 'zh',
    langDir: '../locales/',
    strategy: 'prefix_except_default',
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      title: 'AI 知识库',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'AI 学习知识库 - 个人学习笔记与技术分享' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css',
        },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  content: {
    build: {
      markdown: {
        remarkPlugins: { 'remark-math': {} },
        rehypePlugins: { 'rehype-katex': {} },
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
          langs: [
            'python',
            'javascript',
            'typescript',
            'json',
            'yaml',
            'markdown',
            'bash',
            'shell',
            'html',
            'css',
            'vue',
            'sql',
            'rust',
            'go',
            'java',
            'cpp',
            'c',
          ],
        },
      },
    },
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  site: {
    url: 'https://ai-knowledge-blog.vercel.app',
  },

  sitemap: {
    exclude: ['/private/**'],
  },

  image: {
    quality: 80,
    format: ['webp', 'avif'],
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  eslint: {
    config: {
      stylistic: false,
    },
  },

})
