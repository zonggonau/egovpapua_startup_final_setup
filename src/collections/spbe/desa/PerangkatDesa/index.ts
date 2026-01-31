import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { publicOrTenantAccess } from '@/access/tenantAccess'

export const PerangkatDesa: CollectionConfig = {
  slug: 'perangkat-desa',
  access: {
    create: authenticated,
    read: publicOrTenantAccess,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'nama',
    defaultColumns: ['nama', 'jabatan', 'tenant'],
    group: 'SPBE - Desa',
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
      name: 'nama',
      type: 'text',
      required: true,
      label: 'Nama Lengkap',
    },
    {
      name: 'foto',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto',
    },
    {
      name: 'jabatan',
      type: 'select',
      required: true,
      label: 'Jabatan',
      options: [
        { label: 'Kepala Desa/Kampung', value: 'kepala_desa' },
        { label: 'Sekretaris Desa', value: 'sekdes' },
        { label: 'Kaur Pemerintahan', value: 'kaur_pemerintahan' },
        { label: 'Kaur Pembangunan', value: 'kaur_pembangunan' },
        { label: 'Kaur Kesejahteraan', value: 'kaur_kesejahteraan' },
        { label: 'Kaur Keuangan', value: 'kaur_keuangan' },
        { label: 'Kaur Umum', value: 'kaur_umum' },
        { label: 'Kepala Dusun/RW', value: 'kadus' },
      ],
    },
    {
      name: 'nip',
      type: 'text',
      label: 'NIP/NIK',
    },
    {
      name: 'pendidikan',
      type: 'text',
      label: 'Pendidikan Terakhir',
    },
    {
      name: 'tempatLahir',
      type: 'text',
      label: 'Tempat Lahir',
    },
    {
      name: 'tanggalLahir',
      type: 'date',
      label: 'Tanggal Lahir',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'alamat',
      type: 'textarea',
      label: 'Alamat',
    },
    {
      name: 'telepon',
      type: 'text',
      label: 'No. Telepon',
    },
    {
      name: 'masaJabatan',
      type: 'group',
      label: 'Masa Jabatan',
      fields: [
        {
          name: 'mulai',
          type: 'date',
          label: 'Mulai',
        },
        {
          name: 'selesai',
          type: 'date',
          label: 'Selesai',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'aktif',
      options: [
        { label: 'Aktif', value: 'aktif' },
        { label: 'Tidak Aktif', value: 'tidak_aktif' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
