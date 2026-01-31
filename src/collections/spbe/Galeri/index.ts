import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { publicOrTenantAccess } from '@/access/tenantAccess'

export const Galeri: CollectionConfig = {
  slug: 'galeri',
  access: {
    create: authenticated,
    read: publicOrTenantAccess,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'judul',
    defaultColumns: ['judul', 'jenis', 'tenant', 'createdAt'],
    group: 'SPBE - Common',
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ req, value }) => {
            if (value) return value
            return req.user?.tenant || value
          },
        ],
      },
    },
    {
      name: 'judul',
      type: 'text',
      required: true,
      label: 'Judul',
    },
    {
      name: 'deskripsi',
      type: 'textarea',
      label: 'Deskripsi',
    },
    {
      name: 'jenis',
      type: 'select',
      required: true,
      options: [
        { label: 'Foto', value: 'foto' },
        { label: 'Video', value: 'video' },
        { label: 'Album', value: 'album' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: 'Media',
      admin: {
        condition: (data) => data?.jenis === 'foto' || data?.jenis === 'video',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Items Album',
      admin: {
        condition: (data) => data?.jenis === 'album',
      },
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'tanggal',
      type: 'date',
      label: 'Tanggal',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
  ],
  timestamps: true,
}
