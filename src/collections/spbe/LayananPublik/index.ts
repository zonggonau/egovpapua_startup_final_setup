import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { publicOrTenantAccess } from '@/access/tenantAccess'
import { slugField } from 'payload'

export const LayananPublik: CollectionConfig = {
  slug: 'layanan-publik',
  access: {
    create: authenticated,
    read: publicOrTenantAccess,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'namaLayanan',
    defaultColumns: ['namaLayanan', 'kategori', 'tenant', 'isOnline'],
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
      name: 'namaLayanan',
      type: 'text',
      required: true,
      label: 'Nama Layanan',
    },
    {
      name: 'kategori',
      type: 'select',
      required: true,
      options: [
        { label: 'Perizinan', value: 'perizinan' },
        { label: 'Administrasi Kependudukan', value: 'adminduk' },
        { label: 'Kesehatan', value: 'kesehatan' },
        { label: 'Pendidikan', value: 'pendidikan' },
        { label: 'Sosial', value: 'sosial' },
        { label: 'Infrastruktur', value: 'infrastruktur' },
        { label: 'Lainnya', value: 'lainnya' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'deskripsi',
      type: 'richText',
      required: true,
      label: 'Deskripsi Layanan',
    },
    {
      name: 'persyaratan',
      type: 'array',
      required: true,
      label: 'Persyaratan',
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'prosedur',
      type: 'array',
      required: true,
      label: 'Prosedur/Alur',
      fields: [
        {
          name: 'langkah',
          type: 'number',
          required: true,
        },
        {
          name: 'deskripsi',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'waktuPenyelesaian',
      type: 'group',
      label: 'Waktu Penyelesaian (SLA)',
      fields: [
        {
          name: 'durasi',
          type: 'number',
          required: true,
          label: 'Durasi',
        },
        {
          name: 'satuan',
          type: 'select',
          required: true,
          options: [
            { label: 'Menit', value: 'menit' },
            { label: 'Jam', value: 'jam' },
            { label: 'Hari Kerja', value: 'hari' },
            { label: 'Minggu', value: 'minggu' },
          ],
        },
      ],
    },
    {
      name: 'biaya',
      type: 'group',
      label: 'Biaya',
      fields: [
        {
          name: 'nominal',
          type: 'number',
          defaultValue: 0,
          label: 'Nominal (Rp)',
        },
        {
          name: 'keterangan',
          type: 'text',
          label: 'Keterangan',
          admin: {
            description: 'Contoh: Gratis, Sesuai Retribusi, dll',
          },
        },
      ],
    },
    {
      name: 'isOnline',
      type: 'checkbox',
      defaultValue: false,
      label: 'Layanan Online',
      admin: {
        position: 'sidebar',
        description: 'Apakah layanan ini tersedia secara online?',
      },
    },
    {
      name: 'linkLayanan',
      type: 'text',
      label: 'Link Layanan Online',
      admin: {
        condition: (data) => data?.isOnline === true,
        description: 'URL untuk mengakses layanan online',
      },
    },
    {
      name: 'kontak',
      type: 'group',
      label: 'Kontak Layanan',
      fields: [
        {
          name: 'namaUnit',
          type: 'text',
          label: 'Nama Unit/Bagian',
        },
        {
          name: 'telepon',
          type: 'text',
        },
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'loket',
          type: 'text',
          label: 'Lokasi Loket',
        },
      ],
    },
    {
      name: 'formulir',
      type: 'array',
      label: 'Formulir',
      fields: [
        {
          name: 'namaFormulir',
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
      name: 'faq',
      type: 'array',
      label: 'FAQ',
      fields: [
        {
          name: 'pertanyaan',
          type: 'text',
          required: true,
        },
        {
          name: 'jawaban',
          type: 'textarea',
          required: true,
        },
      ],
    },
    slugField(),
  ],
  timestamps: true,
}
