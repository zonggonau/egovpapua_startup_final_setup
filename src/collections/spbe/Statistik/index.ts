import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { publicOrTenantAccess } from '@/access/tenantAccess'

export const Statistik: CollectionConfig = {
  slug: 'statistik',
  access: {
    create: authenticated,
    read: publicOrTenantAccess,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'judul',
    defaultColumns: ['judul', 'kategori', 'tahun', 'tenant'],
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
      label: 'Judul Statistik',
    },
    {
      name: 'kategori',
      type: 'select',
      required: true,
      options: [
        { label: 'Kependudukan', value: 'kependudukan' },
        { label: 'Ekonomi', value: 'ekonomi' },
        { label: 'Pendidikan', value: 'pendidikan' },
        { label: 'Kesehatan', value: 'kesehatan' },
        { label: 'Infrastruktur', value: 'infrastruktur' },
        { label: 'Sosial', value: 'sosial' },
        { label: 'Pertanian', value: 'pertanian' },
        { label: 'Lainnya', value: 'lainnya' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tahun',
      type: 'number',
      required: true,
      label: 'Tahun',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'deskripsi',
      type: 'richText',
      label: 'Deskripsi',
    },
    {
      name: 'data',
      type: 'array',
      required: true,
      label: 'Data',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
        },
        {
          name: 'nilai',
          type: 'number',
          required: true,
          label: 'Nilai',
        },
        {
          name: 'satuan',
          type: 'text',
          label: 'Satuan',
          admin: {
            description: 'Contoh: orang, jiwa, %, Rp, dll',
          },
        },
      ],
    },
    {
      name: 'visualisasi',
      type: 'select',
      label: 'Jenis Visualisasi',
      options: [
        { label: 'Tabel', value: 'table' },
        { label: 'Bar Chart', value: 'bar' },
        { label: 'Line Chart', value: 'line' },
        { label: 'Pie Chart', value: 'pie' },
        { label: 'Area Chart', value: 'area' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sumber',
      type: 'text',
      label: 'Sumber Data',
      admin: {
        description: 'Contoh: BPS, Dinas Kependudukan, dll',
      },
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      label: 'File Data',
      admin: {
        description: 'Upload file Excel/CSV data lengkap (opsional)',
      },
    },
  ],
  timestamps: true,
}
