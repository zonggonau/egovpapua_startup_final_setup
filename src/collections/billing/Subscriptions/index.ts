import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { filterByTenant, isSuperAdmin } from '@/access/tenantAccess'

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  access: {
    create: authenticated,
    read: ({ req: { user } }) => {
      // Super admin sees all
      if (user?.role === 'super_admin') return true
      // Tenant users only see their own subscriptions
      if (user?.tenant) {
        return {
          tenant: {
            equals: user.tenant,
          },
        }
      }
      return false
    },
    update: ({ req: { user } }) => {
      // Super admin can update all
      if (user?.role === 'super_admin') return true
      // Tenant admin can update their own
      if (user?.role === 'tenant_admin' && user?.tenant) {
        return {
          tenant: {
            equals: user.tenant,
          },
        }
      }
      return false
    },
    delete: isSuperAdmin,
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['tenant', 'plan', 'status', 'startDate', 'endDate'],
    group: 'Billing',
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      label: 'Tenant',
      admin: {
        description: 'Tenant yang berlangganan',
      },
    },
    {
      name: 'plan',
      type: 'relationship',
      relationTo: 'subscription-plans',
      required: true,
      label: 'Paket Langganan',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Active', value: 'active' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Expired', value: 'expired' },
        { label: 'Suspended', value: 'suspended' },
      ],
      admin: {
        description: 'Status langganan saat ini',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      label: 'Tanggal Mulai',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      label: 'Tanggal Berakhir',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'autoRenew',
      type: 'checkbox',
      defaultValue: false,
      label: 'Auto Renew',
      admin: {
        description: 'Perpanjang otomatis saat berakhir',
      },
    },
    {
      name: 'cancelledAt',
      type: 'date',
      label: 'Tanggal Dibatalkan',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        condition: (data) => data?.status === 'cancelled',
      },
    },
    {
      name: 'cancellationReason',
      type: 'textarea',
      label: 'Alasan Pembatalan',
      admin: {
        condition: (data) => data?.status === 'cancelled',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Catatan',
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // Update tenant subscription status when subscription changes
        if (operation === 'create' || operation === 'update') {
          const tenantId = typeof doc.tenant === 'string' ? doc.tenant : doc.tenant?.id

          if (tenantId) {
            // Update tenant's subscriptionStatus based on subscription status
            let subscriptionStatus: 'trial' | 'active' | 'suspended' | 'cancelled' = 'trial'
            if (doc.status === 'active') subscriptionStatus = 'active'
            else if (doc.status === 'suspended') subscriptionStatus = 'suspended'
            else if (doc.status === 'cancelled' || doc.status === 'expired')
              subscriptionStatus = 'cancelled'

            await req.payload.update({
              collection: 'tenants',
              id: tenantId,
              data: {
                subscriptionStatus,
              },
            })
          }
        }
      },
    ],
  },
  timestamps: true,
}
