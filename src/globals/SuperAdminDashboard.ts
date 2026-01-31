import type { GlobalConfig } from 'payload'
import { isSuperAdmin } from '@/access/tenantAccess'

export const SuperAdminDashboard: GlobalConfig = {
  slug: 'super-admin-dashboard',
  access: {
    read: isSuperAdmin,
    update: () => false,
  },
  admin: {
    group: 'Analytics',
    hidden: ({ user }) => user?.role !== 'super_admin',
  },
  fields: [
    {
      name: 'stats',
      type: 'group',
      label: 'Platform Statistics',
      admin: {
        description: 'Real-time platform statistics',
      },
      fields: [
        {
          name: 'totalTenants',
          type: 'number',
          label: 'Total Tenants',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'activeTenants',
          type: 'number',
          label: 'Active Tenants',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'totalRevenue',
          type: 'number',
          label: 'Total Revenue (Rp)',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'monthlyRevenue',
          type: 'number',
          label: 'Monthly Revenue (Rp)',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'tenantsByType',
      type: 'array',
      label: 'Tenants by Type',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'type',
          type: 'text',
        },
        {
          name: 'count',
          type: 'number',
        },
      ],
    },
    {
      name: 'subscriptionStats',
      type: 'array',
      label: 'Subscription Statistics',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'plan',
          type: 'text',
        },
        {
          name: 'count',
          type: 'number',
        },
        {
          name: 'revenue',
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
          name: 'timestamp',
          type: 'date',
        },
      ],
    },
  ],
  hooks: {
    beforeRead: [
      async ({ req }) => {
        // Calculate real-time stats
        const payload = req.payload

        // Get total tenants
        const tenants = await payload.find({
          collection: 'tenants',
          limit: 0,
        })

        // Get active tenants
        const activeTenants = await payload.find({
          collection: 'tenants',
          where: {
            subscriptionStatus: {
              in: ['active', 'trial'],
            },
          },
          limit: 0,
        })

        // Get tenants by type
        const tenantsByType = await payload.find({
          collection: 'tenants',
          limit: 1000,
        })

        const typeCount: Record<string, number> = {}
        tenantsByType.docs.forEach((tenant) => {
          typeCount[tenant.type] = (typeCount[tenant.type] || 0) + 1
        })

        // Get revenue stats
        const payments = await payload.find({
          collection: 'payments',
          where: {
            status: {
              equals: 'success',
            },
          },
          limit: 1000,
        })

        const totalRevenue = payments.docs.reduce((sum, payment) => sum + (payment.amount || 0), 0)

        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const monthlyPayments = payments.docs.filter(
          (p) => new Date(p.createdAt) >= firstDayOfMonth,
        )
        const monthlyRevenue = monthlyPayments.reduce(
          (sum, payment) => sum + (payment.amount || 0),
          0,
        )

        // Return computed data
        return {
          stats: {
            totalTenants: tenants.totalDocs,
            activeTenants: activeTenants.totalDocs,
            totalRevenue,
            monthlyRevenue,
          },
          tenantsByType: Object.entries(typeCount).map(([type, count]) => ({
            type,
            count,
          })),
        }
      },
    ],
  },
}
