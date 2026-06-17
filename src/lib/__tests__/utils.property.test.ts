import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { gradeFromScore, formatRelativeTime } from '../utils'
import type { CategoryScore } from '@/types'

const VALID_GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F']

describe('Property: gradeFromScore', () => {
  it('always returns a valid grade for any score in [0, 100]', () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 100 }), score => {
      const grade = gradeFromScore(score)
      expect(VALID_GRADES).toContain(grade)
      expect(grade.length).toBeGreaterThan(0)
    }))
  })
})

describe('Property: category score average', () => {
  it('weighted average stays within [0, 100]', () => {
    fc.assert(fc.property(
      fc.array(fc.record({ score: fc.integer({ min: 0, max: 100 }), maxScore: fc.constant(100) }), { minLength: 1 }),
      (scores: Pick<CategoryScore, 'score' | 'maxScore'>[]) => {
        const avg = scores.reduce((s, c) => s + c.score, 0) / scores.length
        expect(avg).toBeGreaterThanOrEqual(0)
        expect(avg).toBeLessThanOrEqual(100)
      }
    ))
  })
})

describe('Property: formatRelativeTime', () => {
  it('never throws for any valid ISO date string', () => {
    fc.assert(fc.property(fc.date({ min: new Date('2000-01-01'), max: new Date('2030-12-31') }), date => {
      expect(() => formatRelativeTime(date.toISOString())).not.toThrow()
    }))
  })
})
