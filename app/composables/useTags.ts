import { isPrivateArticle } from '~/utils/content'

interface TagItem {
  name: string
  count: number
}

export function useTags() {
  const { isUnlocked } = usePrivateAuth()

  const { data: tags, status } = useAsyncData(
    `all-tags-${toValue(isUnlocked)}`,
    async () => {
      const articles = await queryCollection('content')
        .select('tags', 'private')
        .all()
        .then(results => results.filter(r => isUnlocked.value || !isPrivateArticle(r as any)))

      const countMap = new Map<string, number>()

      for (const article of articles) {
        const articleTags = (article as unknown as { tags?: string[] }).tags
        if (articleTags && Array.isArray(articleTags)) {
          for (const tag of articleTags) {
            countMap.set(tag, (countMap.get(tag) || 0) + 1)
          }
        }
      }

      const result: TagItem[] = []
      for (const [name, count] of countMap) {
        result.push({ name, count })
      }

      result.sort((a, b) => b.count - a.count)
      return result
    },
    {
      watch: [isUnlocked],
    }
  )

  const pending = computed(() => status.value === 'pending')

  return {
    tags,
    pending,
  }
}
