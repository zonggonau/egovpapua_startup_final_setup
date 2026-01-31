import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { publicOrTenantAccess } from '@/access/tenantAccess'

export const AnggotaDPR: CollectionConfig = {
  slug: 'anggota-dpr',
  access: {
    create: authenticated,
    read: publicOrTenantAccess,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'nama',
    defaultColumns: ['nama', 'fraksi', 'komisi', 'tenant'],
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
        condition: (data, siblingData, { user }) => {
          // Only show for super admin or if creating new
          return user?.role === 'super_admin'
        },
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
      name: 'fraksi',
      type: 'text',
      required: true,
      label: 'Fraksi',
      admin: {
        description: 'Contoh: Fraksi PDI Perjuangan, Fraksi Golkar, dll',
      },
    },
    {
      name: 'dapil',
      type: 'text',
      label: 'Daerah Pemilihan (Dapil)',
    },
    {
      name: 'komisi',
      type: 'array',
      label: 'Komisi',
      fields: [
        {
          name: 'nama',
          type: 'text',
          required: true,
          label: 'Nama Komisi',
        },
        {
          name: 'jabatan',
          type: 'select',
          options: [
            { label: 'Ketua', value: 'ketua' },
            { label: 'Wakil Ketua', value: 'wakil_ketua' },
            { label: 'Anggota', value: 'anggota' },
          ],
        },
      ],
    },
    {
      name: 'jabatanDPR',
      type: 'select',
      label: 'Jabatan di DPR',
      options: [
        { label: 'Ketua DPR', value: 'ketua_dpr' },
        { label: 'Wakil Ketua DPR', value: 'wakil_ketua_dpr' },
        { label: 'Anggota', value: 'anggota' },
      ],
    },
    {
      name: 'periode',
      type: 'text',
      required: true,
      label: 'Periode',
      admin: {
        description: 'Contoh: 2019-2024',
      },
    },
    {
      name: 'biodata',
      type: 'group',
      label: 'Biodata',
      fields: [
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
          name: 'pendidikan',
          type: 'text',
          label: 'Pendidikan Terakhir',
        },
        {
          name: 'pekerjaan',
          type: 'text',
          label: 'Pekerjaan Sebelumnya',
        },
      ],
    },
    {
      name: 'riwayatOrganisasi',
      type: 'array',
      label: 'Riwayat Organisasi',
      fields: [
        {
          name: 'organisasi',
          type: 'text',
          required: true,
        },
        {
          name: 'jabatan',
          type: 'text',
        },
        {
          name: 'tahun',
          type: 'text',
        },
      ],
    },
    {
      name: 'kontak',
      type: 'group',
      label: 'Kontak',
      fields: [
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'telepon',
          type: 'text',
        },
        {
          name: 'alamatKantor',
          type: 'textarea',
          label: 'Alamat Kantor',
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
        { label: 'Pengganti Antar Waktu (PAW)', value: 'paw' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
