import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    // Super admin can do everything
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'type', 'subscriptionStatus'],
    group: 'Multi-Tenant',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nama Instansi',
      admin: {
        description: 'Nama lengkap instansi pemerintah',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'URL slug untuk tenant (contoh: diskominfo-jayapura)',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (value) {
              return value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Jenis Instansi',
      options: [
        { label: 'Provinsi', value: 'provinsi' },
        { label: 'Kabupaten/Kota', value: 'kabupaten' },
        { label: 'OPD (Organisasi Perangkat Daerah)', value: 'opd' },
        { label: 'DPR/DPRD', value: 'dpr' },
        { label: 'Distrik/Kecamatan', value: 'distrik' },
        { label: 'Desa/Kampung', value: 'desa' },
      ],
      admin: {
        description: 'Jenis instansi pemerintahan',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo Instansi',
    },
    {
      name: 'contactInfo',
      type: 'group',
      label: 'Informasi Kontak',
      fields: [
        {
          name: 'address',
          type: 'textarea',
          label: 'Alamat',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Telepon',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
        },
        {
          name: 'website',
          type: 'text',
          label: 'Website',
        },
      ],
    },
    {
      name: 'subscriptionStatus',
      type: 'select',
      required: true,
      defaultValue: 'trial',
      label: 'Status Langganan',
      options: [
        { label: 'Trial', value: 'trial' },
        { label: 'Active', value: 'active' },
        { label: 'Suspended', value: 'suspended' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        description: 'Status langganan tenant',
      },
    },
    {
      name: 'subscription',
      type: 'relationship',
      relationTo: 'subscriptions',
      label: 'Langganan Aktif',
      admin: {
        description: 'Langganan yang sedang aktif',
      },
    },
  ],
  timestamps: true,
}
