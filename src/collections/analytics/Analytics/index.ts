import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '@/access/tenantAccess'

export const Analytics: CollectionConfig = {
  slug: 'analytics',
  access: {
    create: () => true, // Auto-created by system
    read: isSuperAdmin,
    update: () => false,
    delete: isSuperAdmin,
  },
  admin: {
    useAsTitle: 'event',
    defaultColumns: ['event', 'tenant', 'createdAt'],
    group: 'Analytics',
    hidden: ({ user }) => user?.role !== 'super_admin',
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      index: true,
    },
    {
      name: 'event',
      type: 'select',
      required: true,
      options: [
        { label: 'Page View', value: 'page_view' },
        { label: 'Document Download', value: 'document_download' },
        { label: 'Service Access', value: 'service_access' },
        { label: 'News View', value: 'news_view' },
        { label: 'Search', value: 'search' },
        { label: 'Contact Form Submit', value: 'contact_submit' },
      ],
      index: true,
    },
    {
      name: 'metadata',
      type: 'group',
      fields: [
        {
          name: 'path',
          type: 'text',
          label: 'Page Path',
        },
        {
          name: 'referrer',
          type: 'text',
          label: 'Referrer',
        },
        {
          name: 'userAgent',
          type: 'text',
          label: 'User Agent',
        },
        {
          name: 'ip',
          type: 'text',
          label: 'IP Address',
        },
        {
          name: 'resourceId',
          type: 'text',
          label: 'Resource ID',
          admin: {
            description: 'ID of document, news, service, etc',
          },
        },
        {
          name: 'searchQuery',
          type: 'text',
          label: 'Search Query',
        },
      ],
    },
    {
      name: 'sessionId',
      type: 'text',
      label: 'Session ID',
      index: true,
    },
  ],
  timestamps: true,
}
