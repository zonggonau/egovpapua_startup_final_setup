import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { publicOrTenantAccess } from '@/access/tenantAccess'

export const OPDDirectory: CollectionConfig = {
  slug: 'opd-directory',
  access: {
    create: authenticated,
    read: publicOrTenantAccess,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'namaOPD',
    defaultColumns: ['namaOPD', 'jenisOPD', 'tenant'],
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
      name: 'namaOPD',
      type: 'text',
      required: true,
      label: 'Nama OPD',
    },
    {
      name: 'jenisOPD',
      type: 'select',
      required: true,
      label: 'Jenis OPD',
      options: [
        { label: 'Dinas', value: 'dinas' },
        { label: 'Badan', value: 'badan' },
        { label: 'Kantor', value: 'kantor' },
        { label: 'Inspektorat', value: 'inspektorat' },
        { label: 'Sekretariat', value: 'sekretariat' },
        { label: 'Rumah Sakit', value: 'rs' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'kepala',
      type: 'group',
      label: 'Kepala OPD',
      fields: [
        {
          name: 'nama',
          type: 'text',
        },
        {
          name: 'nip',
          type: 'text',
          label: 'NIP',
        },
        {
          name: 'foto',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'alamat',
      type: 'textarea',
      label: 'Alamat',
    },
    {
      name: 'kontak',
      type: 'group',
      label: 'Kontak',
      fields: [
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
      name: 'tugasPokok',
      type: 'richText',
      label: 'Tugas Pokok dan Fungsi',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo OPD',
    },
  ],
  timestamps: true,
}
