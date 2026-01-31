import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { isSuperAdmin } from '@/access/tenantAccess'

export const SubscriptionPlans: CollectionConfig = {
  slug: 'subscription-plans',
  access: {
    // Only super admin can manage plans
    create: isSuperAdmin,
    read: authenticated, // All authenticated users can see plans
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'interval', 'targetTenantType', 'isActive'],
    group: 'Billing',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nama Paket',
      admin: {
        description: 'Contoh: Desa Basic, OPD Premium',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'Identifier unik untuk paket',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Deskripsi',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Harga (Rp)',
      admin: {
        description: 'Harga dalam Rupiah',
      },
    },
    {
      name: 'interval',
      type: 'select',
      required: true,
      defaultValue: 'monthly',
      label: 'Interval Pembayaran',
      options: [
        { label: 'Bulanan', value: 'monthly' },
        { label: 'Tahunan', value: 'yearly' },
      ],
    },
    {
      name: 'targetTenantType',
      type: 'select',
      label: 'Target Jenis Tenant',
      options: [
        { label: 'Provinsi', value: 'provinsi' },
        { label: 'Kabupaten/Kota', value: 'kabupaten' },
        { label: 'OPD', value: 'opd' },
        { label: 'DPR/DPRD', value: 'dpr' },
        { label: 'Distrik', value: 'distrik' },
        { label: 'Desa', value: 'desa' },
      ],
      admin: {
        description: 'Paket ini ditujukan untuk jenis tenant mana',
      },
    },
    {
      name: 'features',
      type: 'array',
      label: 'Fitur',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'limits',
      type: 'group',
      label: 'Batasan',
      fields: [
        {
          name: 'maxPages',
          type: 'number',
          label: 'Maksimal Halaman',
          admin: {
            description: '0 = unlimited',
          },
        },
        {
          name: 'maxPosts',
          type: 'number',
          label: 'Maksimal Posts/Berita',
          admin: {
            description: '0 = unlimited',
          },
        },
        {
          name: 'maxUsers',
          type: 'number',
          label: 'Maksimal Users',
          admin: {
            description: '0 = unlimited',
          },
        },
        {
          name: 'storageGB',
          type: 'number',
          label: 'Storage (GB)',
          admin: {
            description: 'Kapasitas storage dalam GB',
          },
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Aktif',
      admin: {
        description: 'Apakah paket ini tersedia untuk dipilih',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured',
      admin: {
        description: 'Tampilkan sebagai paket unggulan',
      },
    },
  ],
  timestamps: true,
}
