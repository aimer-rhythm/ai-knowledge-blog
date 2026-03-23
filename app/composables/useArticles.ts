import type { Ref } from 'vue'
import { compareContentDatesDesc, isPrivateArticle } from '~/utils/content'

interface ArticleResult {
  path: string
  title: string
  description?: string
  image?: string
  date: string
  category?: string
  tags?: string[]
  readingTime?: number
}

interface UseArticlesOptions {
  category?: string | Ref<string | undefined>
  tag?: string | Ref<string | undefined>
  page?: number | Ref<number>
  perPage?: number
}

export function useArticles(options: UseArticlesOptions = {}) {
  const {
    category,
    tag,
    page = 1,
    perPage = 10,
  } = options

  const currentPage = isRef(page) ? page : ref(page)
  const categoryVal = isRef(category) ? category : ref(category)
  const tagVal = isRef(tag) ? tag : ref(tag)
  const { isUnlocked } = usePrivateAuth()

  function getTagLikePattern(tag: string) {
    return `%"${tag.replaceAll('"', '\\"')}"%`
  }

  const asyncKey = computed(() => `articles-${toValue(categoryVal)}-${toValue(tagVal)}-${toValue(isUnlocked)}`)

  const { data: allArticles, status } = useAsyncData(
    asyncKey,
    () => {
      let query = queryCollection('content')

      if (toValue(categoryVal)) {
        query = query.where('category', '=', toValue(categoryVal) as string)
      }
      if (toValue(tagVal)) {
        query = query.where('tags', 'LIKE', getTagLikePattern(toValue(tagVal) as string))
      }

      return query
        .select('path', 'title', 'description', 'image', 'date', 'category', 'tags', 'private')
        .all()
        .then(results => results.filter(r => isUnlocked.value || !isPrivateArticle(r as any)).sort(compareContentDatesDesc)) as Promise<ArticleResult[]>
    },
    {
      watch: [categoryVal, tagVal, isUnlocked],
      default: () => [],
    }
  )

  const totalPages = computed(() => {
    const count = allArticles.value.length
    return Math.max(1, Math.ceil(count / perPage))
  })
  const totalCount = computed(() => allArticles.value.length)
  const articles = computed(() => {
    const pageNumber = Math.max(1, toValue(currentPage))
    const start = (pageNumber - 1) * perPage
    const end = start + perPage

    return allArticles.value.slice(start, end)
  })
  const pending = computed(() => status.value === 'idle' || status.value === 'pending')

  return {
    articles: articles as Ref<ArticleResult[]>,
    totalCount,
    totalPages,
    pending,
    currentPage,
  }
}
