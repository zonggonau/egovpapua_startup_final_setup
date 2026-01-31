import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { publicOrTenantAccess } from '@/access/tenantAccess'

export const ProdukHukum: CollectionConfig = {
  slug: 'produk-hukum',
  access: {
    create: authenticated,
    read: publicOrTenantAccess,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'judul',
    defaultColumns: ['judul', 'jenis', 'nomor', 'tahun', 'tenant'],
    group: 'SPBE - DPR',
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
      name: 'jenis',
      type: 'select',
      required: true,
      label: 'Jenis Produk Hukum',
      options: [
        { label: 'Peraturan Daerah (Perda)', value: 'perda' },
        { label: 'Peraturan Daerah Provinsi (Perdasi)', value: 'perdasi' },
        { label: 'Keputusan DPRD', value: 'keputusan' },
        { label: 'Peraturan DPRD', value: 'peraturan' },
        { label: 'Rancangan Perda (Raperda)', value: 'raperda' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'nomor',
      type: 'text',
      required: true,
      label: 'Nomor',
      admin: {
        description: 'Contoh: 5',
      },
    },
    {
      name: 'tahun',
      type: 'number',
      required: true,
      label: 'Tahun',
    },
    {
      name: 'tentang',
      type: 'textarea',
      required: true,
      label: 'Tentang',
    },
    {
      name: 'tanggalPenetapan',
      type: 'date',
      label: 'Tanggal Penetapan',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'tanggalPengundangan',
      type: 'date',
      label: 'Tanggal Pengundangan',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'naskahAkademik',
      type: 'richText',
      label: 'Naskah Akademik',
    },
    {
      name: 'pemrakarsa',
      type: 'select',
      label: 'Pemrakarsa',
      options: [
        { label: 'DPRD', value: 'dprd' },
        { label: 'Kepala Daerah', value: 'kepala_daerah' },
        { label: 'Inisiatif Bersama', value: 'bersama' },
      ],
    },
    {
      name: 'prosesLegislasi',
      type: 'array',
      label: 'Proses Legislasi',
      fields: [
        {
          name: 'tahap',
          type: 'text',
          required: true,
          label: 'Tahap',
        },
        {
          name: 'tanggal',
          type: 'date',
          label: 'Tanggal',
        },
        {
          name: 'keterangan',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'File Produk Hukum',
      admin: {
        description: 'Upload file PDF',
      },
    },
    {
      name: 'lampiran',
      type: 'array',
      label: 'Lampiran',
      fields: [
        {
          name: 'namaFile',
          type: 'text',
          required: true,
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'berlaku',
      label: 'Status',
      options: [
        { label: 'Rancangan', value: 'rancangan' },
        { label: 'Dalam Pembahasan', value: 'pembahasan' },
        { label: 'Berlaku', value: 'berlaku' },
        { label: 'Dicabut', value: 'dicabut' },
        { label: 'Direvisi', value: 'direvisi' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
