import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { publicOrTenantAccess } from '@/access/tenantAccess'

export const ProgramKerja: CollectionConfig = {
  slug: 'program-kerja',
  access: {
    create: authenticated,
    read: publicOrTenantAccess,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'namaProgram',
    defaultColumns: ['namaProgram', 'tahun', 'status', 'tenant'],
    group: 'SPBE - OPD',
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
      name: 'namaProgram',
      type: 'text',
      required: true,
      label: 'Nama Program',
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
      label: 'Deskripsi Program',
    },
    {
      name: 'tujuan',
      type: 'textarea',
      label: 'Tujuan',
    },
    {
      name: 'sasaran',
      type: 'array',
      label: 'Sasaran',
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'indikatorKinerja',
      type: 'array',
      label: 'Indikator Kinerja',
      fields: [
        {
          name: 'indikator',
          type: 'text',
          required: true,
        },
        {
          name: 'target',
          type: 'text',
          required: true,
        },
        {
          name: 'realisasi',
          type: 'text',
          label: 'Realisasi',
        },
        {
          name: 'satuan',
          type: 'text',
        },
      ],
    },
    {
      name: 'anggaran',
      type: 'group',
      label: 'Anggaran',
      fields: [
        {
          name: 'pagu',
          type: 'number',
          label: 'Pagu Anggaran (Rp)',
        },
        {
          name: 'realisasi',
          type: 'number',
          label: 'Realisasi (Rp)',
        },
        {
          name: 'persentase',
          type: 'number',
          label: 'Persentase (%)',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'kegiatan',
      type: 'array',
      label: 'Kegiatan',
      fields: [
        {
          name: 'namaKegiatan',
          type: 'text',
          required: true,
        },
        {
          name: 'waktu',
          type: 'text',
          label: 'Waktu Pelaksanaan',
        },
        {
          name: 'penanggungJawab',
          type: 'text',
          label: 'Penanggung Jawab',
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Belum Dimulai', value: 'belum' },
            { label: 'Sedang Berjalan', value: 'berjalan' },
            { label: 'Selesai', value: 'selesai' },
            { label: 'Tertunda', value: 'tertunda' },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'perencanaan',
      label: 'Status Program',
      options: [
        { label: 'Perencanaan', value: 'perencanaan' },
        { label: 'Sedang Berjalan', value: 'berjalan' },
        { label: 'Selesai', value: 'selesai' },
        { label: 'Evaluasi', value: 'evaluasi' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'dokumen',
      type: 'array',
      label: 'Dokumen Pendukung',
      fields: [
        {
          name: 'namaDokumen',
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
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-calculate persentase realisasi anggaran
        if (data.anggaran?.pagu && data.anggaran?.realisasi) {
          data.anggaran.persentase = (data.anggaran.realisasi / data.anggaran.pagu) * 100
        }
        return data
      },
    ],
  },
  timestamps: true,
}
