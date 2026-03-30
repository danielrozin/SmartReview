import { describe, it, expect } from 'vitest'
import { formatNumber, getScoreColor, getScoreBgColor, getScoreLabel } from '../utils'

describe('formatNumber', () => {
  it('returns plain number for values under 1000', () => {
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(1)).toBe('1')
    expect(formatNumber(999)).toBe('999')
  })

  it('formats thousands with K suffix', () => {
    expect(formatNumber(1000)).toBe('1.0K')
    expect(formatNumber(1500)).toBe('1.5K')
    expect(formatNumber(999999)).toBe('1000.0K')
  })

  it('formats millions with M suffix', () => {
    expect(formatNumber(1000000)).toBe('1.0M')
    expect(formatNumber(2500000)).toBe('2.5M')
    expect(formatNumber(10000000)).toBe('10.0M')
  })
})

describe('getScoreColor', () => {
  it('returns green for scores >= 80', () => {
    expect(getScoreColor(80)).toBe('text-trust-green')
    expect(getScoreColor(100)).toBe('text-trust-green')
  })

  it('returns yellow for scores 60-79', () => {
    expect(getScoreColor(60)).toBe('text-yellow-500')
    expect(getScoreColor(79)).toBe('text-yellow-500')
  })

  it('returns red for scores < 60', () => {
    expect(getScoreColor(59)).toBe('text-trust-red')
    expect(getScoreColor(0)).toBe('text-trust-red')
  })
})

describe('getScoreBgColor', () => {
  it('returns green bg for scores >= 80', () => {
    expect(getScoreBgColor(80)).toBe('bg-trust-green')
    expect(getScoreBgColor(95)).toBe('bg-trust-green')
  })

  it('returns yellow bg for scores 60-79', () => {
    expect(getScoreBgColor(60)).toBe('bg-yellow-500')
    expect(getScoreBgColor(75)).toBe('bg-yellow-500')
  })

  it('returns red bg for scores < 60', () => {
    expect(getScoreBgColor(50)).toBe('bg-trust-red')
    expect(getScoreBgColor(0)).toBe('bg-trust-red')
  })
})

describe('getScoreLabel', () => {
  it('returns Excellent for scores >= 90', () => {
    expect(getScoreLabel(90)).toBe('Excellent')
    expect(getScoreLabel(100)).toBe('Excellent')
  })

  it('returns Great for scores 80-89', () => {
    expect(getScoreLabel(80)).toBe('Great')
    expect(getScoreLabel(89)).toBe('Great')
  })

  it('returns Good for scores 70-79', () => {
    expect(getScoreLabel(70)).toBe('Good')
    expect(getScoreLabel(79)).toBe('Good')
  })

  it('returns Fair for scores 60-69', () => {
    expect(getScoreLabel(60)).toBe('Fair')
    expect(getScoreLabel(69)).toBe('Fair')
  })

  it('returns Mixed for scores 50-59', () => {
    expect(getScoreLabel(50)).toBe('Mixed')
    expect(getScoreLabel(59)).toBe('Mixed')
  })

  it('returns Poor for scores < 50', () => {
    expect(getScoreLabel(49)).toBe('Poor')
    expect(getScoreLabel(0)).toBe('Poor')
  })
})
