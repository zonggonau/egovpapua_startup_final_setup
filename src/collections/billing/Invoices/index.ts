import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { isSuperAdmin } from '@/access/tenantAccess'

// Auto-generate invoice number
const generateInvoiceNumber = (): string => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
  return `INV-${year}${month}-${random}`
}

export const Invoices: CollectionConfig = {
  slug: 'invoices',
  access: {
    create: authenticated,
    read: ({ req: { user } }) => {
      if (user?.role === 'super_admin') return true
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
      if (user?.role === 'super_admin') return true
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
    useAsTitle: 'invoiceNumber',
    defaultColumns: ['invoiceNumber', 'tenant', 'amount', 'status', 'dueDate'],
    group: 'Billing',
  },
  fields: [
    {
      name: 'invoiceNumber',
      type: 'text',
      required: true,
      unique: true,
      label: 'Nomor Invoice',
      admin: {
        readOnly: true,
        description: 'Auto-generated invoice number',
      },
      hooks: {
        beforeValidate: [
          ({ value, operation }) => {
            if (operation === 'create' && !value) {
              return generateInvoiceNumber()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      label: 'Tenant',
    },
    {
      name: 'subscription',
      type: 'relationship',
      relationTo: 'subscriptions',
      label: 'Langganan',
      admin: {
        description: 'Langganan terkait (opsional)',
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      label: 'Item Invoice',
      fields: [
        {
          name: 'description',
          type: 'text',
          required: true,
          label: 'Deskripsi',
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          defaultValue: 1,
          label: 'Jumlah',
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
          label: 'Harga Satuan (Rp)',
        },
        {
          name: 'amount',
          type: 'number',
          required: true,
          label: 'Total (Rp)',
          admin: {
            readOnly: true,
          },
          hooks: {
            beforeValidate: [
              ({ siblingData }) => {
                const quantity = siblingData?.quantity || 1
                const unitPrice = siblingData?.unitPrice || 0
                return quantity * unitPrice
              },
            ],
          },
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      label: 'Subtotal (Rp)',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'tax',
      type: 'number',
      defaultValue: 0,
      label: 'Pajak (Rp)',
      admin: {
        description: 'PPN atau pajak lainnya',
      },
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      label: 'Total Tagihan (Rp)',
      admin: {
        readOnly: true,
        description: 'Subtotal + Pajak',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      label: 'Status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Overdue', value: 'overdue' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'dueDate',
      type: 'date',
      required: true,
      label: 'Jatuh Tempo',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'paidAt',
      type: 'date',
      label: 'Tanggal Bayar',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        condition: (data) => data?.status === 'paid',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Catatan',
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Calculate subtotal from items
        if (data.items && Array.isArray(data.items)) {
          data.subtotal = data.items.reduce((sum: number, item: any) => {
            return sum + (item.amount || 0)
          }, 0)
        }

        // Calculate total amount
        data.amount = (data.subtotal || 0) + (data.tax || 0)

        return data
      },
    ],
  },
  timestamps: true,
}
