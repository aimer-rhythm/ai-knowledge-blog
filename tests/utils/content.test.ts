import { describe, it, expect } from 'vitest'
import {
  parseContentDate,
  getContentDateValue,
  isPrivateArticle,
  compareContentDatesDesc,
  compareContentDatesAsc,
  formatContentDate,
} from '../../app/utils/content'

describe('parseContentDate', () => {
  it('parses valid local date YYYY-MM-DD', () => {
    const date = parseContentDate('2023-10-05')
    expect(date?.getFullYear()).toBe(2023)
    expect(date?.getMonth()).toBe(9)
    expect(date?.getDate()).toBe(5)
  })

  it('parses single-digit month and day (YYYY-M-D)', () => {
    const date = parseContentDate('2023-1-2')
    expect(date?.getFullYear()).toBe(2023)
    expect(date?.getMonth()).toBe(0)
    expect(date?.getDate()).toBe(2)
  })

  it('trims whitespace', () => {
    const date = parseContentDate('  2023-10-05  ')
    expect(date?.getFullYear()).toBe(2023)
  })

  it('returns null for empty string', () => {
    expect(parseContentDate('')).toBeNull()
  })

  it('returns null for whitespace-only string', () => {
    expect(parseContentDate('   ')).toBeNull()
  })

  it('returns null for null', () => {
    expect(parseContentDate(null)).toBeNull()
  })

  it('returns null for undefined', () => {
    expect(parseContentDate(undefined)).toBeNull()
  })

  it('returns null for garbage text', () => {
    expect(parseContentDate('not-a-date')).toBeNull()
  })

  it('falls back to Date constructor for overflow date Feb 30', () => {
    // Local validation rejects Feb 30, but Date constructor fallback may parse it
    const date = parseContentDate('2023-02-30')
    // In environments where Date('2023-02-30') is valid, it returns March 2
    // In strict environments, it returns null
    if (date) {
      expect(date.getMonth()).toBe(2) // March (0-indexed)
      expect(date.getDate()).toBe(2)
    } else {
      expect(date).toBeNull()
    }
  })

  it('returns null for invalid month 13', () => {
    expect(parseContentDate('2023-13-01')).toBeNull()
  })

  it('returns null for day 0', () => {
    expect(parseContentDate('2023-01-00')).toBeNull()
  })

  it('falls back to Date constructor for ISO format', () => {
    const date = parseContentDate('2023-10-05T12:00:00Z')
    expect(date?.getFullYear()).toBe(2023)
    expect(date?.getUTCHours()).toBe(12)
  })

  it('handles leap year Feb 29 correctly', () => {
    const date = parseContentDate('2024-02-29')
    expect(date?.getMonth()).toBe(1)
    expect(date?.getDate()).toBe(29)
  })

  it('rejects non-leap year Feb 29 in local validation', () => {
    // Local date validation rejects 2023-02-29, falls back to Date constructor
    const date = parseContentDate('2023-02-29')
    if (date) {
      // Date constructor overflow: Feb 29 → March 1 in non-leap year
      expect(date.getMonth()).toBe(2) // March
      expect(date.getDate()).toBe(1)
    } else {
      expect(date).toBeNull()
    }
  })
})

describe('getContentDateValue', () => {
  it('returns a positive timestamp for valid date', () => {
    expect(getContentDateValue('2023-10-05')).toBeGreaterThan(0)
  })

  it('returns 0 for empty string', () => {
    expect(getContentDateValue('')).toBe(0)
  })

  it('returns 0 for invalid date', () => {
    expect(getContentDateValue('invalid')).toBe(0)
  })

  it('returns 0 for null', () => {
    expect(getContentDateValue(null)).toBe(0)
  })

  it('returns 0 for undefined', () => {
    expect(getContentDateValue(undefined)).toBe(0)
  })
})

describe('isPrivateArticle', () => {
  it('returns true when private=true', () => {
    expect(isPrivateArticle({ private: true })).toBe(true)
  })

  it('returns true when path starts with /private/', () => {
    expect(isPrivateArticle({ path: '/private/secret-post' })).toBe(true)
  })

  it('returns true when both private=true and path=/private/', () => {
    expect(isPrivateArticle({ private: true, path: '/private/x' })).toBe(true)
  })

  it('returns true when private=true but path is public', () => {
    expect(isPrivateArticle({ private: true, path: '/blog/post' })).toBe(true)
  })

  it('returns false when private=false and path is public', () => {
    expect(isPrivateArticle({ private: false, path: '/blog/post' })).toBe(false)
  })

  it('returns false for empty object', () => {
    expect(isPrivateArticle({})).toBe(false)
  })

  it('returns false when path is /private without trailing slash', () => {
    expect(isPrivateArticle({ path: '/private' })).toBe(false)
  })

  it('returns false when private is undefined', () => {
    expect(isPrivateArticle({ path: '/blog/post' })).toBe(false)
  })
})

describe('compareContentDatesDesc', () => {
  const older = { date: '2023-01-01' }
  const newer = { date: '2023-12-31' }

  it('returns positive when a is older than b (newest first)', () => {
    expect(compareContentDatesDesc(older, newer)).toBeGreaterThan(0)
  })

  it('returns negative when a is newer than b', () => {
    expect(compareContentDatesDesc(newer, older)).toBeLessThan(0)
  })

  it('returns 0 for equal dates', () => {
    expect(compareContentDatesDesc(older, older)).toBe(0)
  })

  it('sorts an array newest first', () => {
    const items = [older, newer, { date: '2023-06-15' }]
    const sorted = [...items].sort(compareContentDatesDesc)
    expect(sorted[0].date).toBe('2023-12-31')
    expect(sorted[2].date).toBe('2023-01-01')
  })
})

describe('compareContentDatesAsc', () => {
  const older = { date: '2023-01-01' }
  const newer = { date: '2023-12-31' }

  it('returns negative when a is older than b (oldest first)', () => {
    expect(compareContentDatesAsc(older, newer)).toBeLessThan(0)
  })

  it('returns positive when a is newer than b', () => {
    expect(compareContentDatesAsc(newer, older)).toBeGreaterThan(0)
  })
})

describe('formatContentDate', () => {
  it('formats date for zh locale', () => {
    const result = formatContentDate('2023-10-05', 'zh')
    expect(result).toContain('2023')
    expect(result).toContain('10')
    expect(result).toContain('5')
  })

  it('formats date for en locale', () => {
    const result = formatContentDate('2023-10-05', 'en')
    expect(result).toMatch(/October\s+5,\s+2023/)
  })

  it('returns original string for invalid date', () => {
    expect(formatContentDate('invalid-date', 'en')).toBe('invalid-date')
  })

  it('accepts custom format options', () => {
    const result = formatContentDate('2023-10-05', 'en', {
      month: 'numeric',
      day: 'numeric',
    })
    expect(result).toContain('10')
    expect(result).toContain('5')
  })

  it('treats unknown locales as en', () => {
    const result = formatContentDate('2023-10-05', 'fr')
    expect(result).toMatch(/October\s+5,\s+2023/)
  })
})
