import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role', 'tenant'],
    useAsTitle: 'name',
    group: 'Multi-Tenant',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'viewer',
      options: [
        { label: 'Super Admin', value: 'super_admin' },
        { label: 'Tenant Admin', value: 'tenant_admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
      ],
      admin: {
        description: 'Role menentukan hak akses user',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      label: 'Tenant',
      admin: {
        description: 'Tenant yang dimiliki user (kosongkan untuk super admin)',
        condition: (data) => data?.role !== 'super_admin',
      },
      // Required for non-super admin users
      required: true,
      hooks: {
        beforeValidate: [
          ({ data, value }) => {
            // Super admin doesn't need tenant
            if (data?.role === 'super_admin') {
              return undefined
            }
            return value
          },
        ],
      },
    },
  ],
  timestamps: true,
}
