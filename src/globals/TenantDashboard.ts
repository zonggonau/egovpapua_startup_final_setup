import type { GlobalConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const TenantDashboard: GlobalConfig = {
  slug: 'tenant-dashboard',
  access: {
    read: authenticated,
    update: () => false,
  },
  admin: {
    group: 'Analytics',
  },
  fields: [
    {
      name: 'stats',
      type: 'group',
      label: 'Website Statistics',
      fields: [
        {
          name: 'totalPageViews',
          type: 'number',
          label: 'Total Page Views',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'monthlyPageViews',
          type: 'number',
          label: 'Monthly Page Views',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'totalNews',
          type: 'number',
          label: 'Total News',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'totalServices',
          type: 'number',
          label: 'Total Services',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'totalDocuments',
          type: 'number',
          label: 'Total Documents',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'subscription',
      type: 'group',
      label: 'Subscription Info',
      fields: [
        {
          name: 'plan',
          type: 'text',
          label: 'Current Plan',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'status',
          type: 'text',
          label: 'Status',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'nextBillingDate',
          type: 'date',
          label: 'Next Billing Date',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'daysRemaining',
          type: 'number',
          label: 'Days Remaining',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'popularContent',
      type: 'array',
      label: 'Popular Content',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'type',
          type: 'text',
        },
        {
          name: 'views',
          type: 'number',
        },
      ],
    },
    {
      name: 'recentActivity',
      type: 'array',
      label: 'Recent Activity',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'activity',
          type: 'text',
        },
        {
          name: 'user',
          type: 'text',
        },
        {
          name: 'timestamp',
          type: 'date',
        },
      ],
    },
  ],
  hooks: {
    beforeRead: [
      async ({ req }) => {
        const payload = req.payload
        const user = req.user

        if (!user?.tenant) {
          return {}
        }

        const tenantId = typeof user.tenant === 'string' ? user.tenant : user.tenant.id

        // Get tenant
        const tenant = await payload.findByID({
          collection: 'tenants',
          id: tenantId,
        })

        // Get analytics
        const analytics = await payload.find({
          collection: 'analytics',
          where: {
            tenant: {
              equals: tenantId,
            },
          },
          limit: 1000,
        })

        const totalPageViews = analytics.docs.filter((a) => a.event === 'page_view').length
        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const monthlyPageViews = analytics.docs.filter(
          (a) => a.event === 'page_view' && new Date(a.createdAt) >= firstDayOfMonth,
        ).length

        // Get content counts
        const news = await payload.find({
          collection: 'berita',
          where: { tenant: { equals: tenantId } },
          limit: 0,
        })

        const services = await payload.find({
          collection: 'layanan-publik',
          where: { tenant: { equals: tenantId } },
          limit: 0,
        })

        const documents = await payload.find({
          collection: 'dokumen',
          where: { tenant: { equals: tenantId } },
          limit: 0,
        })

        // Get subscription info
        const subscription = tenant.subscription
          ? await payload.findByID({
              collection: 'subscriptions',
              id:
                typeof tenant.subscription === 'string'
                  ? tenant.subscription
                  : tenant.subscription.id,
              depth: 2,
            })
          : null

        const nextBillingDate = subscription?.endDate ? new Date(subscription.endDate) : null
        const daysRemaining = nextBillingDate
          ? Math.ceil((nextBillingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          : 0

        return {
          stats: {
            totalPageViews,
            monthlyPageViews,
            totalNews: news.totalDocs,
            totalServices: services.totalDocs,
            totalDocuments: documents.totalDocs,
          },
          subscription: {
            plan: subscription?.plan
              ? typeof subscription.plan === 'string'
                ? subscription.plan
                : subscription.plan.name
              : 'No Plan',
            status: subscription?.status || 'inactive',
            nextBillingDate,
            daysRemaining,
          },
        }
      },
    ],
  },
}
