import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { publicOrTenantAccess } from '@/access/tenantAccess'

export const Agenda: CollectionConfig = {
  slug: 'agenda',
  access: {
    create: authenticated,
    read: publicOrTenantAccess,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'judul',
    defaultColumns: ['judul', 'tanggalMulai', 'tenant', 'status'],
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
      label: 'Judul Kegiatan',
    },
    {
      name: 'deskripsi',
      type: 'richText',
      label: 'Deskripsi',
    },
    {
      name: 'tanggalMulai',
      type: 'date',
      required: true,
      label: 'Tanggal Mulai',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'tanggalSelesai',
      type: 'date',
      label: 'Tanggal Selesai',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'lokasi',
      type: 'text',
      label: 'Lokasi',
    },
    {
      name: 'penyelenggara',
      type: 'text',
      label: 'Penyelenggara',
    },
    {
      name: 'kategori',
      type: 'select',
      options: [
        { label: 'Rapat', value: 'rapat' },
        { label: 'Seminar', value: 'seminar' },
        { label: 'Sosialisasi', value: 'sosialisasi' },
        { label: 'Pelatihan', value: 'pelatihan' },
        { label: 'Upacara', value: 'upacara' },
        { label: 'Lainnya', value: 'lainnya' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'dijadwalkan',
      options: [
        { label: 'Dijadwalkan', value: 'dijadwalkan' },
        { label: 'Berlangsung', value: 'berlangsung' },
        { label: 'Selesai', value: 'selesai' },
        { label: 'Dibatalkan', value: 'dibatalkan' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: true,
      label: 'Publik',
      admin: {
        position: 'sidebar',
        description: 'Tampilkan di kalender publik',
      },
    },
  ],
  timestamps: true,
}
