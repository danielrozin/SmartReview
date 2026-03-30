/**
 * Tests for /api/vote route validation logic (Zod-based).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const mockPrisma = vi.hoisted(() => ({
  vote: {
    findFirst: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  review: { update: vi.fn() },
  discussionThread: { update: vi.fn() },
  comment: { update: vi.fn() },
}))

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}))

import { POST } from '../vote/route'

function makeRequest(body: unknown): NextRequest {
  return new NextRequest(new URL('/api/vote', 'http://localhost:3000'), {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('POST /api/vote', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects missing userId', async () => {
    const res = await POST(makeRequest({ voteType: 'upvote', threadId: 't1' }))
    expect(res.status).toBe(400)
  })

  it('rejects missing voteType', async () => {
    const res = await POST(makeRequest({ userId: 'u1', threadId: 't1' }))
    expect(res.status).toBe(400)
  })

  it('rejects when no target provided', async () => {
    const res = await POST(makeRequest({ userId: 'u1', voteType: 'upvote' }))
    expect(res.status).toBe(400)
  })

  it('rejects when multiple targets provided', async () => {
    const res = await POST(
      makeRequest({ userId: 'u1', voteType: 'upvote', reviewId: 'r1', threadId: 't1' })
    )
    expect(res.status).toBe(400)
  })

  it('rejects invalid voteType', async () => {
    const res = await POST(
      makeRequest({ userId: 'u1', voteType: 'invalid_type', reviewId: 'r1' })
    )
    expect(res.status).toBe(400)
  })

  it('accepts all valid vote types', async () => {
    const validTypes = ['upvote', 'downvote', 'helpful', 'agree', 'same_issue', 'owner_confirmed']

    for (const voteType of validTypes) {
      mockPrisma.vote.findFirst.mockResolvedValue(null)
      mockPrisma.vote.create.mockResolvedValue({ id: 'v1' })

      const res = await POST(makeRequest({ userId: 'u1', voteType, reviewId: 'r1' }))
      expect(res.status).toBe(201)
    }
  })

  it('toggles off existing vote', async () => {
    mockPrisma.vote.findFirst.mockResolvedValue({ id: 'existing-vote' })
    mockPrisma.vote.delete.mockResolvedValue({})

    const res = await POST(
      makeRequest({ userId: 'u1', voteType: 'helpful', reviewId: 'r1' })
    )

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.action).toBe('removed')
    expect(mockPrisma.vote.delete).toHaveBeenCalledWith({ where: { id: 'existing-vote' } })
  })

  it('creates new vote and returns 201', async () => {
    mockPrisma.vote.findFirst.mockResolvedValue(null)
    mockPrisma.vote.create.mockResolvedValue({ id: 'new-vote' })

    const res = await POST(
      makeRequest({ userId: 'u1', voteType: 'upvote', threadId: 't1' })
    )

    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.action).toBe('created')
  })

  it('increments helpfulCount when voting helpful on review', async () => {
    mockPrisma.vote.findFirst.mockResolvedValue(null)
    mockPrisma.vote.create.mockResolvedValue({ id: 'v1' })
    mockPrisma.review.update.mockResolvedValue({})

    await POST(makeRequest({ userId: 'u1', voteType: 'helpful', reviewId: 'r1' }))

    expect(mockPrisma.review.update).toHaveBeenCalledWith({
      where: { id: 'r1' },
      data: { helpfulCount: { increment: 1 } },
    })
  })

  it('increments upvotes on thread when upvoting', async () => {
    mockPrisma.vote.findFirst.mockResolvedValue(null)
    mockPrisma.vote.create.mockResolvedValue({ id: 'v1' })
    mockPrisma.discussionThread.update.mockResolvedValue({})

    await POST(makeRequest({ userId: 'u1', voteType: 'upvote', threadId: 't1' }))

    expect(mockPrisma.discussionThread.update).toHaveBeenCalledWith({
      where: { id: 't1' },
      data: { upvotes: { increment: 1 } },
    })
  })
})
