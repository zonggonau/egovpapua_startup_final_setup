import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { publicOrTenantAccess } from '@/access/tenantAccess'

export const KabupatenDirectory: CollectionConfig = {
  slug: 'kabupaten-directory',
  access: {
    create: authenticated,
    read: publicOrTenantAccess,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'namaKabupaten',
    defaultColumns: ['namaKabupaten', 'jenisWilayah', 'tenant'],
    group: 'SPBE - Provinsi',
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
      name: 'namaKabupaten',
      type: 'text',
      required: true,
      label: 'Nama Kabupaten/Kota',
    },
    {
      name: 'jenisWilayah',
      type: 'select',
      required: true,
      options: [
        { label: 'Kabupaten', value: 'kabupaten' },
        { label: 'Kota', value: 'kota' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'bupatiWalikota',
      type: 'group',
      label: 'Bupati/Walikota',
      fields: [
        {
          name: 'nama',
          type: 'text',
        },
        {
          name: 'foto',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'wakilBupatiWalikota',
      type: 'group',
      label: 'Wakil Bupati/Walikota',
      fields: [
        {
          name: 'nama',
          type: 'text',
        },
        {
          name: 'foto',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'ibukota',
      type: 'text',
      label: 'Ibukota',
    },
    {
      name: 'luasWilayah',
      type: 'number',
      label: 'Luas Wilayah (km²)',
    },
    {
      name: 'jumlahPenduduk',
      type: 'number',
      label: 'Jumlah Penduduk',
    },
    {
      name: 'jumlahDistrik',
      type: 'number',
      label: 'Jumlah Distrik/Kecamatan',
    },
    {
      name: 'jumlahKampung',
      type: 'number',
      label: 'Jumlah Kampung/Kelurahan',
    },
    {
      name: 'kontak',
      type: 'group',
      label: 'Kontak',
      fields: [
        {
          name: 'alamat',
          type: 'textarea',
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
          name: 'website',
          type: 'text',
        },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo Kabupaten/Kota',
    },
  ],
  timestamps: true,
}
