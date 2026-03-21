import type { Ref } from 'vue'
import { compareContentDatesDesc } from '~/utils/content'

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

  const { data: countData, status: countStatus } = useAsyncData(
    `articles-count-${toValue(categoryVal)}-${toValue(tagVal)}-${toValue(isUnlocked)}`,
    () => {
      let query = queryCollection('content')

      if (toValue(categoryVal)) {
        query = query.where('category', '=', toValue(categoryVal) as string)
      }
      if (toValue(tagVal)) {
        query = query.where('tags', 'LIKE', getTagLikePattern(toValue(tagVal) as string))
      }

      return query.select('private').all()
        .then(results => results.filter(r => isUnlocked.value || !(r as any).private).length)
    },
    {
      watch: [categoryVal, tagVal, isUnlocked],
    }
  )

  const totalPages = computed(() => {
    const count = countData.value ?? 0
    return Math.max(1, Math.ceil(count / perPage))
  })
  const totalCount = computed(() => countData.value ?? 0)

  const { data: articles, status } = useAsyncData(
    `articles-${toValue(categoryVal)}-${toValue(tagVal)}-${toValue(currentPage)}-${toValue(isUnlocked)}`,
    () => {
      let query = queryCollection('content')

      if (toValue(categoryVal)) {
        query = query.where('category', '=', toValue(categoryVal) as string)
      }
      if (toValue(tagVal)) {
        query = query.where('tags', 'LIKE', getTagLikePattern(toValue(tagVal) as string))
      }

      const pageNumber = Math.max(1, toValue(currentPage))
      const start = (pageNumber - 1) * perPage
      const end = start + perPage

      return query
        .select('path', 'title', 'description', 'image', 'date', 'category', 'tags', 'private')
        .all()
        .then(results => results.filter(r => isUnlocked.value || !(r as any).private).sort(compareContentDatesDesc).slice(start, end)) as Promise<ArticleResult[]>
    },
    {
      watch: [currentPage, categoryVal, tagVal, isUnlocked],
    }
  )

  const pending = computed(() => status.value === 'pending' || countStatus.value === 'pending')

  return {
    articles: articles as Ref<ArticleResult[] | null>,
    totalCount,
    totalPages,
    pending,
    currentPage,
  }
}
