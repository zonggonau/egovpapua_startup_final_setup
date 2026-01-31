import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { publicOrTenantAccess } from '@/access/tenantAccess'

export const Dokumen: CollectionConfig = {
  slug: 'dokumen',
  access: {
    create: authenticated,
    read: publicOrTenantAccess,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'judul',
    defaultColumns: ['judul', 'jenisDokumen', 'tenant', 'tanggalTerbit'],
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
      label: 'Judul Dokumen',
    },
    {
      name: 'jenisDokumen',
      type: 'select',
      required: true,
      label: 'Jenis Dokumen',
      options: [
        { label: 'Peraturan Daerah (Perda)', value: 'perda' },
        { label: 'Peraturan Gubernur/Bupati/Walikota', value: 'pergub_perbup' },
        { label: 'Keputusan (SK)', value: 'sk' },
        { label: 'Surat Edaran', value: 'surat_edaran' },
        { label: 'Instruksi', value: 'instruksi' },
        { label: 'Laporan', value: 'laporan' },
        { label: 'Dokumen Perencanaan', value: 'perencanaan' },
        { label: 'Lainnya', value: 'lainnya' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'nomorDokumen',
      type: 'text',
      label: 'Nomor Dokumen',
      admin: {
        description: 'Contoh: No. 5 Tahun 2024',
      },
    },
    {
      name: 'tanggalTerbit',
      type: 'date',
      required: true,
      label: 'Tanggal Terbit',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'tentang',
      type: 'textarea',
      required: true,
      label: 'Tentang',
      admin: {
        description: 'Perihal/tentang dokumen',
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
      label: 'File Dokumen',
      admin: {
        description: 'Upload file PDF dokumen',
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
        { label: 'Berlaku', value: 'berlaku' },
        { label: 'Dicabut', value: 'dicabut' },
        { label: 'Direvisi', value: 'direvisi' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'kategori',
      type: 'array',
      label: 'Kategori',
      fields: [
        {
          name: 'nama',
          type: 'text',
        },
      ],
    },
    {
      name: 'versi',
      type: 'group',
      label: 'Versi Dokumen',
      fields: [
        {
          name: 'nomorVersi',
          type: 'text',
          label: 'Nomor Versi',
          defaultValue: '1.0',
        },
        {
          name: 'catatanRevisi',
          type: 'textarea',
          label: 'Catatan Revisi',
        },
        {
          name: 'dokumenSebelumnya',
          type: 'relationship',
          relationTo: 'dokumen',
          label: 'Dokumen Sebelumnya',
          admin: {
            description: 'Jika ini adalah revisi dari dokumen lain',
          },
        },
      ],
    },
    {
      name: 'jumlahUnduhan',
      type: 'number',
      defaultValue: 0,
      label: 'Jumlah Unduhan',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
