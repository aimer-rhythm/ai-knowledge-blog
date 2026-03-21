import { getContentDateValue } from '~/utils/content'

interface CategoryItem {
  name: string
  count: number
  image?: string
}

function normalizeImage(image?: string): string | undefined {
  const normalized = image?.trim()
  return normalized ? normalized : undefined
}

export function useCategories() {
  const { isUnlocked } = usePrivateAuth()

  const { data: categories, status } = useAsyncData(
    `all-categories-${toValue(isUnlocked)}`,
    async () => {
      const articles = await queryCollection('content')
        .select('category', 'image', 'date', 'private')
        .all()
        .then(results => results.filter(r => isUnlocked.value || !(r as any).private))

      const categoryMap = new Map<string, CategoryItem & { latestDate: number }>()

      for (const article of articles) {
        const item = article as unknown as { category?: string, image?: string, date?: string }
        const cat = item.category
        if (cat) {
          const current = categoryMap.get(cat) ?? {
            name: cat,
            count: 0,
            image: undefined,
            latestDate: 0,
          }

          current.count += 1

          const articleDate = getContentDateValue(item.date)
          if (articleDate >= current.latestDate) {
            current.image = normalizeImage(item.image)
            current.latestDate = articleDate
          }

          categoryMap.set(cat, current)
        }
      }

      const result: CategoryItem[] = []
      for (const category of categoryMap.values()) {
        result.push({
          name: category.name,
          count: category.count,
          image: category.image,
        })
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
    categories,
    pending,
  }
}
