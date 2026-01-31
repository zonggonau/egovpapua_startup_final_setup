import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { publicOrTenantAccess } from '@/access/tenantAccess'
import { slugField } from 'payload'

export const Berita: CollectionConfig = {
  slug: 'berita',
  access: {
    create: authenticated,
    read: publicOrTenantAccess,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'judul',
    defaultColumns: ['judul', 'kategori', 'tenant', 'publishedAt'],
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
      label: 'Judul Berita',
    },
    {
      name: 'kategori',
      type: 'select',
      required: true,
      options: [
        { label: 'Berita Utama', value: 'utama' },
        { label: 'Pengumuman', value: 'pengumuman' },
        { label: 'Kegiatan', value: 'kegiatan' },
        { label: 'Informasi', value: 'informasi' },
        { label: 'Press Release', value: 'press_release' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Gambar Utama',
    },
    {
      name: 'ringkasan',
      type: 'textarea',
      required: true,
      label: 'Ringkasan',
      admin: {
        description: 'Ringkasan singkat berita (max 200 karakter)',
      },
      maxLength: 200,
    },
    {
      name: 'konten',
      type: 'richText',
      required: true,
      label: 'Konten Berita',
    },
    {
      name: 'galeri',
      type: 'array',
      label: 'Galeri Foto',
      fields: [
        {
          name: 'image',
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
    {
      name: 'penulis',
      type: 'relationship',
      relationTo: 'users',
      label: 'Penulis',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ req, value }) => {
            if (value) return value
            return req.user?.id || value
          },
        ],
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Tanggal Publish',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeValidate: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date().toISOString()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'isPinned',
      type: 'checkbox',
      defaultValue: false,
      label: 'Pin ke Beranda',
      admin: {
        position: 'sidebar',
        description: 'Tampilkan di bagian atas beranda',
      },
    },
    slugField(),
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // Auto-set penulis jika belum ada
        if (!data.penulis && req.user) {
          data.penulis = req.user.id
        }
        return data
      },
    ],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
  timestamps: true,
}
