import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { publicOrTenantAccess } from '@/access/tenantAccess'

export const Transparansi: CollectionConfig = {
  slug: 'transparansi',
  access: {
    create: authenticated,
    read: publicOrTenantAccess,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'judul',
    defaultColumns: ['judul', 'jenis', 'tahun', 'tenant'],
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
      name: 'jenis',
      type: 'select',
      required: true,
      label: 'Jenis Laporan',
      options: [
        { label: 'LKIP (Laporan Kinerja Instansi Pemerintah)', value: 'lkip' },
        { label: 'LAKIP (Laporan Akuntabilitas Kinerja)', value: 'lakip' },
        { label: 'Laporan Keuangan', value: 'keuangan' },
        { label: 'APBD/APBDes', value: 'apbd' },
        { label: 'Realisasi Anggaran', value: 'realisasi' },
        { label: 'Laporan Aset', value: 'aset' },
        { label: 'Laporan Gratifikasi', value: 'gratifikasi' },
        { label: 'LHKPN', value: 'lhkpn' },
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
      name: 'periode',
      type: 'select',
      label: 'Periode',
      options: [
        { label: 'Triwulan 1', value: 'tw1' },
        { label: 'Triwulan 2', value: 'tw2' },
        { label: 'Triwulan 3', value: 'tw3' },
        { label: 'Triwulan 4', value: 'tw4' },
        { label: 'Semester 1', value: 'sem1' },
        { label: 'Semester 2', value: 'sem2' },
        { label: 'Tahunan', value: 'tahunan' },
      ],
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
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'File Laporan',
      admin: {
        description: 'Upload file PDF laporan',
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
      name: 'ringkasan',
      type: 'group',
      label: 'Ringkasan Data',
      fields: [
        {
          name: 'totalAnggaran',
          type: 'number',
          label: 'Total Anggaran (Rp)',
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
        },
      ],
    },
  ],
  timestamps: true,
}
