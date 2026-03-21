const LOCAL_DATE_PATTERN = /^(\d{4})-(\d{1,2})-(\d{1,2})$/

export function parseContentDate(dateStr?: string | null): Date | null {
  if (!dateStr) return null

  const normalized = dateStr.trim()
  if (!normalized) return null

  const localMatch = normalized.match(LOCAL_DATE_PATTERN)
  if (localMatch) {
    const [, yearStr, monthStr, dayStr] = localMatch
    const year = Number(yearStr)
    const month = Number(monthStr)
    const day = Number(dayStr)
    const date = new Date(year, month - 1, day)

    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return date
    }
  }

  const parsed = new Date(normalized)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function getContentDateValue(dateStr?: string | null): number {
  return parseContentDate(dateStr)?.getTime() ?? 0
}

export function isPrivateArticle(article: { path?: string; private?: boolean }): boolean {
  return article.private === true || (article.path?.startsWith('/private/') ?? false)
}

export function compareContentDatesDesc<T extends { date?: string | null }>(a: T, b: T): number {
  return getContentDateValue(b.date) - getContentDateValue(a.date)
}

export function compareContentDatesAsc<T extends { date?: string | null }>(a: T, b: T): number {
  return getContentDateValue(a.date) - getContentDateValue(b.date)
}

export function formatContentDate(
  dateStr: string,
  locale: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
): string {
  const date = parseContentDate(dateStr)
  if (!date) return dateStr

  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', options).format(date)
}
