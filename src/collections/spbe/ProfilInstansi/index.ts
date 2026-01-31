import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { publicOrTenantAccess } from '@/access/tenantAccess'

export const ProfilInstansi: CollectionConfig = {
  slug: 'profil-instansi',
  access: {
    create: authenticated,
    read: publicOrTenantAccess,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'namaInstansi',
    defaultColumns: ['namaInstansi', 'tenant', 'updatedAt'],
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
      name: 'namaInstansi',
      type: 'text',
      required: true,
      label: 'Nama Instansi',
    },
    {
      name: 'visi',
      type: 'textarea',
      label: 'Visi',
      admin: {
        description: 'Visi instansi',
      },
    },
    {
      name: 'misi',
      type: 'array',
      label: 'Misi',
      fields: [
        {
          name: 'item',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'sejarah',
      type: 'richText',
      label: 'Sejarah',
      admin: {
        description: 'Sejarah singkat instansi',
      },
    },
    {
      name: 'tugasPokok',
      type: 'richText',
      label: 'Tugas Pokok dan Fungsi',
    },
    {
      name: 'strukturOrganisasi',
      type: 'group',
      label: 'Struktur Organisasi',
      fields: [
        {
          name: 'bagan',
          type: 'upload',
          relationTo: 'media',
          label: 'Bagan Struktur',
        },
        {
          name: 'deskripsi',
          type: 'richText',
          label: 'Deskripsi',
        },
      ],
    },
    {
      name: 'pejabat',
      type: 'array',
      label: 'Pejabat',
      fields: [
        {
          name: 'nama',
          type: 'text',
          required: true,
        },
        {
          name: 'jabatan',
          type: 'text',
          required: true,
        },
        {
          name: 'foto',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'nip',
          type: 'text',
          label: 'NIP',
        },
        {
          name: 'pendidikan',
          type: 'text',
        },
        {
          name: 'riwayat',
          type: 'textarea',
          label: 'Riwayat Singkat',
        },
      ],
    },
    {
      name: 'kontak',
      type: 'group',
      label: 'Informasi Kontak',
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
          name: 'fax',
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
        {
          name: 'jamLayanan',
          type: 'textarea',
          label: 'Jam Layanan',
        },
      ],
    },
    {
      name: 'socialMedia',
      type: 'array',
      label: 'Media Sosial',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Twitter/X', value: 'twitter' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'TikTok', value: 'tiktok' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  timestamps: true,
}
