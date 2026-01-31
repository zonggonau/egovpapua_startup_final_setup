import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { publicOrTenantAccess } from '@/access/tenantAccess'

export const JadwalSidang: CollectionConfig = {
  slug: 'jadwal-sidang',
  access: {
    create: authenticated,
    read: publicOrTenantAccess,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'judul',
    defaultColumns: ['judul', 'jenisSidang', 'tanggal', 'status', 'tenant'],
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
      label: 'Judul Sidang',
    },
    {
      name: 'jenisSidang',
      type: 'select',
      required: true,
      label: 'Jenis Sidang',
      options: [
        { label: 'Sidang Paripurna', value: 'paripurna' },
        { label: 'Rapat Komisi', value: 'komisi' },
        { label: 'Rapat Badan Anggaran', value: 'banggar' },
        { label: 'Rapat Badan Legislasi', value: 'baleg' },
        { label: 'Rapat Gabungan', value: 'gabungan' },
        { label: 'Rapat Dengar Pendapat', value: 'rdp' },
        { label: 'Rapat Kerja', value: 'raker' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tanggal',
      type: 'date',
      required: true,
      label: 'Tanggal',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'waktuSelesai',
      type: 'date',
      label: 'Waktu Selesai',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'tempat',
      type: 'text',
      required: true,
      label: 'Tempat',
    },
    {
      name: 'agenda',
      type: 'richText',
      required: true,
      label: 'Agenda',
    },
    {
      name: 'komisi',
      type: 'text',
      label: 'Komisi/Badan',
      admin: {
        condition: (data) =>
          data?.jenisSidang === 'komisi' ||
          data?.jenisSidang === 'banggar' ||
          data?.jenisSidang === 'baleg',
      },
    },
    {
      name: 'peserta',
      type: 'array',
      label: 'Peserta/Undangan',
      fields: [
        {
          name: 'nama',
          type: 'text',
          required: true,
        },
        {
          name: 'jabatan',
          type: 'text',
        },
        {
          name: 'instansi',
          type: 'text',
        },
      ],
    },
    {
      name: 'dokumen',
      type: 'array',
      label: 'Dokumen Sidang',
      fields: [
        {
          name: 'namaDokumen',
          type: 'text',
          required: true,
        },
        {
          name: 'jenis',
          type: 'select',
          options: [
            { label: 'Undangan', value: 'undangan' },
            { label: 'Agenda', value: 'agenda' },
            { label: 'Risalah', value: 'risalah' },
            { label: 'Keputusan', value: 'keputusan' },
            { label: 'Lainnya', value: 'lainnya' },
          ],
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
      defaultValue: 'dijadwalkan',
      label: 'Status',
      options: [
        { label: 'Dijadwalkan', value: 'dijadwalkan' },
        { label: 'Berlangsung', value: 'berlangsung' },
        { label: 'Selesai', value: 'selesai' },
        { label: 'Ditunda', value: 'ditunda' },
        { label: 'Dibatalkan', value: 'dibatalkan' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'hasilSidang',
      type: 'richText',
      label: 'Hasil Sidang',
      admin: {
        condition: (data) => data?.status === 'selesai',
      },
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: true,
      label: 'Terbuka untuk Publik',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
