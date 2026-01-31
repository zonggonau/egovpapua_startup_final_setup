import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { publicOrTenantAccess } from '@/access/tenantAccess'

export const APBDes: CollectionConfig = {
  slug: 'apbdes',
  access: {
    create: authenticated,
    read: publicOrTenantAccess,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'tahun',
    defaultColumns: ['tahun', 'totalPendapatan', 'totalBelanja', 'tenant'],
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
      name: 'tahun',
      type: 'number',
      required: true,
      label: 'Tahun Anggaran',
      unique: true,
    },
    {
      name: 'pendapatan',
      type: 'group',
      label: 'Pendapatan',
      fields: [
        {
          name: 'items',
          type: 'array',
          label: 'Rincian Pendapatan',
          fields: [
            {
              name: 'sumber',
              type: 'text',
              required: true,
              label: 'Sumber Pendapatan',
            },
            {
              name: 'anggaran',
              type: 'number',
              required: true,
              label: 'Anggaran (Rp)',
            },
            {
              name: 'realisasi',
              type: 'number',
              label: 'Realisasi (Rp)',
            },
          ],
        },
      ],
    },
    {
      name: 'totalPendapatan',
      type: 'number',
      label: 'Total Pendapatan (Rp)',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'belanja',
      type: 'group',
      label: 'Belanja',
      fields: [
        {
          name: 'items',
          type: 'array',
          label: 'Rincian Belanja',
          fields: [
            {
              name: 'bidang',
              type: 'select',
              required: true,
              label: 'Bidang',
              options: [
                { label: 'Penyelenggaraan Pemerintahan Desa', value: 'pemerintahan' },
                { label: 'Pelaksanaan Pembangunan Desa', value: 'pembangunan' },
                { label: 'Pembinaan Kemasyarakatan', value: 'kemasyarakatan' },
                { label: 'Pemberdayaan Masyarakat', value: 'pemberdayaan' },
                { label: 'Penanggulangan Bencana', value: 'bencana' },
              ],
            },
            {
              name: 'kegiatan',
              type: 'text',
              required: true,
            },
            {
              name: 'anggaran',
              type: 'number',
              required: true,
              label: 'Anggaran (Rp)',
            },
            {
              name: 'realisasi',
              type: 'number',
              label: 'Realisasi (Rp)',
            },
          ],
        },
      ],
    },
    {
      name: 'totalBelanja',
      type: 'number',
      label: 'Total Belanja (Rp)',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'pembiayaan',
      type: 'group',
      label: 'Pembiayaan',
      fields: [
        {
          name: 'penerimaan',
          type: 'number',
          label: 'Penerimaan Pembiayaan (Rp)',
        },
        {
          name: 'pengeluaran',
          type: 'number',
          label: 'Pengeluaran Pembiayaan (Rp)',
        },
      ],
    },
    {
      name: 'dokumen',
      type: 'upload',
      relationTo: 'media',
      label: 'Dokumen APBDes',
      admin: {
        description: 'Upload file PDF APBDes',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'rancangan',
      options: [
        { label: 'Rancangan', value: 'rancangan' },
        { label: 'Ditetapkan', value: 'ditetapkan' },
        { label: 'Perubahan', value: 'perubahan' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-calculate total pendapatan
        if (data.pendapatan?.items) {
          data.totalPendapatan = data.pendapatan.items.reduce(
            (sum: number, item: any) => sum + (item.anggaran || 0),
            0,
          )
        }

        // Auto-calculate total belanja
        if (data.belanja?.items) {
          data.totalBelanja = data.belanja.items.reduce(
            (sum: number, item: any) => sum + (item.anggaran || 0),
            0,
          )
        }

        return data
      },
    ],
  },
  timestamps: true,
}
