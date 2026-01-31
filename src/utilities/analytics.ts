import { getPayload } from 'payload'
import configPromise from '@payload-config'

export interface AnalyticsEvent {
  tenant?: string | number
  event:
    | 'page_view'
    | 'document_download'
    | 'service_access'
    | 'news_view'
    | 'search'
    | 'contact_submit'
  metadata?: {
    path?: string
    referrer?: string
    userAgent?: string
    ip?: string
    resourceId?: string
    searchQuery?: string
  }
  sessionId?: string
}

/**
 * Track analytics event
 */
export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  try {
    const payload = await getPayload({ config: configPromise })

    await payload.create({
      collection: 'analytics',
      data: event,
    })
  } catch (error) {
    console.error('Failed to track event:', error)
    // Don't throw - analytics should not break the app
  }
}

/**
 * Get analytics for tenant
 */
export async function getTenantAnalytics(
  tenantId: string | number,
  startDate?: Date,
  endDate?: Date,
) {
  const payload = await getPayload({ config: configPromise })

  const where: any = {
    tenant: {
      equals: tenantId,
    },
  }

  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) {
      where.createdAt.greater_than_equal = startDate.toISOString()
    }
    if (endDate) {
      where.createdAt.less_than_equal = endDate.toISOString()
    }
  }

  const analytics = await payload.find({
    collection: 'analytics',
    where,
    limit: 10000,
  })

  return analytics.docs
}

/**
 * Get popular content
 */
export async function getPopularContent(tenantId: string | number, limit: number = 10) {
  const events = await getTenantAnalytics(tenantId)

  // Count views by resource
  const viewCounts: Record<string, { count: number; type: string }> = {}

  events.forEach((event) => {
    if (event.metadata?.resourceId) {
      const key = `${event.event}_${event.metadata.resourceId}`
      if (!viewCounts[key]) {
        viewCounts[key] = { count: 0, type: event.event }
      }
      viewCounts[key].count++
    }
  })

  // Sort by count
  const sorted = Object.entries(viewCounts)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, limit)

  return sorted.map(([key, data]) => ({
    resourceId: key.split('_')[1],
    type: data.type,
    views: data.count,
  }))
}

/**
 * Get analytics summary
 */
export async function getAnalyticsSummary(tenantId: string | number) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - 7)

  const [allTime, thisMonth, thisWeek] = await Promise.all([
    getTenantAnalytics(tenantId),
    getTenantAnalytics(tenantId, startOfMonth),
    getTenantAnalytics(tenantId, startOfWeek),
  ])

  const countByEvent = (events: any[]) => {
    const counts: Record<string, number> = {}
    events.forEach((event) => {
      counts[event.event] = (counts[event.event] || 0) + 1
    })
    return counts
  }

  return {
    allTime: {
      total: allTime.length,
      byEvent: countByEvent(allTime),
    },
    thisMonth: {
      total: thisMonth.length,
      byEvent: countByEvent(thisMonth),
    },
    thisWeek: {
      total: thisWeek.length,
      byEvent: countByEvent(thisWeek),
    },
  }
}

/**
 * Get revenue analytics
 */
export async function getRevenueAnalytics(startDate?: Date, endDate?: Date) {
  const payload = await getPayload({ config: configPromise })

  const where: any = {
    status: {
      equals: 'success',
    },
  }

  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) {
      where.createdAt.greater_than_equal = startDate.toISOString()
    }
    if (endDate) {
      where.createdAt.less_than_equal = endDate.toISOString()
    }
  }

  const payments = await payload.find({
    collection: 'payments',
    where,
    limit: 10000,
  })

  const totalRevenue = payments.docs.reduce((sum, payment) => sum + (payment.amount || 0), 0)

  // Group by month
  const byMonth: Record<string, number> = {}
  payments.docs.forEach((payment) => {
    const date = new Date(payment.createdAt)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    byMonth[key] = (byMonth[key] || 0) + (payment.amount || 0)
  })

  return {
    totalRevenue,
    totalTransactions: payments.totalDocs,
    averageTransaction: totalRevenue / payments.totalDocs || 0,
    byMonth,
  }
}
