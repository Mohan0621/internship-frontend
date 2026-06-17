import { describe, it, expect } from 'vitest'
import { gradeFromScore, scoreToColor, formatDate, cn, formatFileSize, truncate } from '../utils'

describe('gradeFromScore', () => {
  it('returns A+ for 100', () => expect(gradeFromScore(100)).toBe('A+'))
  it('returns A+ for 95', () => expect(gradeFromScore(95)).toBe('A+'))
  it('returns A for 90', () => expect(gradeFromScore(90)).toBe('A'))
  it('returns A- for 85', () => expect(gradeFromScore(85)).toBe('A-'))
  it('returns B+ for 80', () => expect(gradeFromScore(80)).toBe('B+'))
  it('returns B for 75', () => expect(gradeFromScore(75)).toBe('B'))
  it('returns B- for 70', () => expect(gradeFromScore(70)).toBe('B-'))
  it('returns C+ for 65', () => expect(gradeFromScore(65)).toBe('C+'))
  it('returns C for 60', () => expect(gradeFromScore(60)).toBe('C'))
  it('returns D for 50', () => expect(gradeFromScore(50)).toBe('D'))
  it('returns F for 0', () => expect(gradeFromScore(0)).toBe('F'))
  it('returns F for 49', () => expect(gradeFromScore(49)).toBe('F'))
})

describe('scoreToColor', () => {
  it('green for 80+', () => expect(scoreToColor(80)).toBe('green'))
  it('green for 100', () => expect(scoreToColor(100)).toBe('green'))
  it('yellow for 60-79', () => expect(scoreToColor(60)).toBe('yellow'))
  it('yellow for 79', () => expect(scoreToColor(79)).toBe('yellow'))
  it('red for below 60', () => expect(scoreToColor(59)).toBe('red'))
  it('red for 0', () => expect(scoreToColor(0)).toBe('red'))
})

describe('formatDate', () => {
  it('formats ISO string', () => {
    const result = formatDate('2024-01-15T10:00:00Z')
    expect(result).toContain('2024')
    expect(result).toContain('Jan')
  })
  it('returns input on invalid string', () => {
    expect(formatDate('invalid')).toBe('invalid')
  })
})

describe('cn', () => {
  it('joins class names', () => expect(cn('foo', 'bar')).toBe('foo bar'))
  it('ignores falsy values', () => expect(cn('foo', undefined, false as unknown as string, 'bar')).toBe('foo bar'))
  it('handles empty', () => expect(cn()).toBe(''))
})

describe('formatFileSize', () => {
  it('bytes', () => expect(formatFileSize(512)).toBe('512 B'))
  it('kilobytes', () => expect(formatFileSize(1536)).toBe('1.5 KB'))
  it('megabytes', () => expect(formatFileSize(2 * 1024 * 1024)).toBe('2.0 MB'))
})

describe('truncate', () => {
  it('does not truncate short strings', () => expect(truncate('hello', 10)).toBe('hello'))
  it('truncates long strings', () => expect(truncate('hello world', 5)).toBe('hello...'))
})
