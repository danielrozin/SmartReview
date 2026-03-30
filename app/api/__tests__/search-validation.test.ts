/**
 * Tests for /api/search route validation logic.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const mockPrisma = vi.hoisted(() => ({
  product: {
    findMany: vi.fn(),
  },
}))

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}))

import { GET } from '../search/route'

function makeRequest(url: string): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost:3000'))
}

describe('GET /api/search', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns empty results for missing query', async () => {
    const res = await GET(makeRequest('/api/search'))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.products).toEqual([])
    expect(data.total).toBe(0)
  })

  it('returns empty results for query shorter than 2 chars', async () => {
    const res = await GET(makeRequest('/api/search?q=a'))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.products).toEqual([])
  })

  it('queries DB for valid search term', async () => {
    mockPrisma.product.findMany.mockResolvedValue([])

    const res = await GET(makeRequest('/api/search?q=sony'))
    expect(res.status).toBe(200)

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            { name: { contains: 'sony', mode: 'insensitive' } },
            { brand: { contains: 'sony', mode: 'insensitive' } },
            { description: { contains: 'sony', mode: 'insensitive' } },
          ]),
        }),
      })
    )
  })

  it('caps limit at 50', async () => {
    mockPrisma.product.findMany.mockResolvedValue([])

    await GET(makeRequest('/api/search?q=test&limit=100'))

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 50 })
    )
  })

  it('orders by smartScore descending', async () => {
    mockPrisma.product.findMany.mockResolvedValue([])

    await GET(makeRequest('/api/search?q=test'))

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { smartScore: 'desc' } })
    )
  })

  it('includes category in results', async () => {
    mockPrisma.product.findMany.mockResolvedValue([])

    await GET(makeRequest('/api/search?q=test'))

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: { category: { select: { name: true, slug: true } } },
      })
    )
  })
})
