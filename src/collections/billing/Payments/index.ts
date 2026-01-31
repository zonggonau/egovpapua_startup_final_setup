import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { isSuperAdmin } from '@/access/tenantAccess'

export const Payments: CollectionConfig = {
  slug: 'payments',
  access: {
    create: authenticated,
    read: ({ req: { user } }) => {
      if (user?.role === 'super_admin') return true
      if (user?.tenant) {
        return {
          'invoice.tenant': {
            equals: user.tenant,
          },
        }
      }
      return false
    },
    update: isSuperAdmin, // Only super admin can update payments
    delete: isSuperAdmin,
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['invoice', 'amount', 'method', 'status', 'createdAt'],
    group: 'Billing',
  },
  fields: [
    {
      name: 'invoice',
      type: 'relationship',
      relationTo: 'invoices',
      required: true,
      label: 'Invoice',
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      label: 'Jumlah Pembayaran (Rp)',
    },
    {
      name: 'method',
      type: 'select',
      required: true,
      label: 'Metode Pembayaran',
      options: [
        { label: 'Midtrans - Credit Card', value: 'midtrans_cc' },
        { label: 'Midtrans - Bank Transfer', value: 'midtrans_bank_transfer' },
        { label: 'Midtrans - E-Wallet (GoPay, OVO, etc)', value: 'midtrans_ewallet' },
        { label: 'Midtrans - QRIS', value: 'midtrans_qris' },
        { label: 'Manual Transfer', value: 'manual_transfer' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Success', value: 'success' },
        { label: 'Failed', value: 'failed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'midtransData',
      type: 'group',
      label: 'Midtrans Data',
      admin: {
        condition: (data) => data?.method?.startsWith('midtrans'),
      },
      fields: [
        {
          name: 'orderId',
          type: 'text',
          label: 'Order ID',
          admin: {
            description: 'Midtrans order_id',
          },
        },
        {
          name: 'transactionId',
          type: 'text',
          label: 'Transaction ID',
          admin: {
            description: 'Midtrans transaction_id',
          },
        },
        {
          name: 'transactionStatus',
          type: 'text',
          label: 'Transaction Status',
          admin: {
            description: 'Status dari Midtrans',
          },
        },
        {
          name: 'paymentType',
          type: 'text',
          label: 'Payment Type',
          admin: {
            description: 'Jenis pembayaran dari Midtrans',
          },
        },
        {
          name: 'snapToken',
          type: 'text',
          label: 'Snap Token',
          admin: {
            description: 'Token untuk Snap payment',
          },
        },
        {
          name: 'snapUrl',
          type: 'text',
          label: 'Snap URL',
          admin: {
            description: 'URL untuk pembayaran Snap',
          },
        },
        {
          name: 'vaNumber',
          type: 'text',
          label: 'VA Number',
          admin: {
            description: 'Virtual Account number (untuk bank transfer)',
          },
        },
        {
          name: 'bank',
          type: 'text',
          label: 'Bank',
          admin: {
            description: 'Bank yang digunakan',
          },
        },
      ],
    },
    {
      name: 'manualTransferData',
      type: 'group',
      label: 'Manual Transfer Data',
      admin: {
        condition: (data) => data?.method === 'manual_transfer',
      },
      fields: [
        {
          name: 'accountName',
          type: 'text',
          label: 'Nama Rekening Pengirim',
        },
        {
          name: 'accountNumber',
          type: 'text',
          label: 'Nomor Rekening Pengirim',
        },
        {
          name: 'bankName',
          type: 'text',
          label: 'Nama Bank',
        },
        {
          name: 'transferDate',
          type: 'date',
          label: 'Tanggal Transfer',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'proofOfPayment',
          type: 'upload',
          relationTo: 'media',
          label: 'Bukti Transfer',
        },
      ],
    },
    {
      name: 'metadata',
      type: 'json',
      label: 'Metadata',
      admin: {
        description: 'Data tambahan dari payment gateway (JSON)',
      },
    },
    {
      name: 'processedAt',
      type: 'date',
      label: 'Tanggal Diproses',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
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
      async ({ doc, req, operation, previousDoc }) => {
        // Update invoice status when payment is successful
        if (doc.status === 'success' && previousDoc?.status !== 'success') {
          const invoiceId = typeof doc.invoice === 'string' ? doc.invoice : doc.invoice?.id

          if (invoiceId) {
            await req.payload.update({
              collection: 'invoices',
              id: invoiceId,
              data: {
                status: 'paid',
                paidAt: new Date().toISOString(),
              },
            })
          }
        }
      },
    ],
  },
  timestamps: true,
}
