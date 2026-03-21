import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.string(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        image: z.string().optional(),
        private: z.boolean().optional(),
      }),
    }),
  },
})
