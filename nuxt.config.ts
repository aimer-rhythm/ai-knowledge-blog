// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxtjs/sitemap',
    '@nuxt/eslint',
  ],

  app: {
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

  image: {
    quality: 80,
    format: ['webp', 'avif'],
  },

  fonts: {
    families: [
      { name: 'Inter', provider: 'google' },
      { name: 'Noto Sans SC', provider: 'google' },
      { name: 'JetBrains Mono', provider: 'google' },
    ],
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  eslint: {
    config: {
      stylistic: false,
    },
  },

  nitro: {
    prerender: {
      routes: ['/sitemap.xml'],
    },
  },
})
