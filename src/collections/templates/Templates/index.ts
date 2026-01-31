import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { isSuperAdmin } from '@/access/tenantAccess'

export const Templates: CollectionConfig = {
  slug: 'templates',
  access: {
    create: isSuperAdmin, // Only super admin can create templates
    read: authenticated,
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'targetTenantType', 'isActive', 'isDefault'],
    group: 'Template System',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Template Name',
      admin: {
        description: 'Contoh: "Modern Desa", "Professional OPD", "Legislative DPR"',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'URL-friendly identifier',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'targetTenantType',
      type: 'select',
      required: true,
      label: 'Target Tenant Type',
      options: [
        { label: 'Provinsi', value: 'provinsi' },
        { label: 'Kabupaten/Kota', value: 'kabupaten' },
        { label: 'OPD', value: 'opd' },
        { label: 'DPR/DPRD', value: 'dpr' },
        { label: 'Distrik', value: 'distrik' },
        { label: 'Desa/Kampung', value: 'desa' },
        { label: 'Universal', value: 'universal' },
      ],
      admin: {
        description: 'Template ini ditujukan untuk jenis tenant mana',
      },
    },
    {
      name: 'preview',
      type: 'group',
      label: 'Preview',
      fields: [
        {
          name: 'thumbnail',
          type: 'upload',
          relationTo: 'media',
          label: 'Thumbnail',
          admin: {
            description: 'Screenshot template untuk preview',
          },
        },
        {
          name: 'demoUrl',
          type: 'text',
          label: 'Demo URL',
          admin: {
            description: 'Link ke demo template (opsional)',
          },
        },
      ],
    },
    {
      name: 'layout',
      type: 'group',
      label: 'Layout Configuration',
      fields: [
        {
          name: 'headerStyle',
          type: 'select',
          defaultValue: 'default',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Centered', value: 'centered' },
            { label: 'Minimal', value: 'minimal' },
            { label: 'Full Width', value: 'full-width' },
          ],
        },
        {
          name: 'footerStyle',
          type: 'select',
          defaultValue: 'default',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Minimal', value: 'minimal' },
            { label: 'Extended', value: 'extended' },
          ],
        },
        {
          name: 'sidebarPosition',
          type: 'select',
          defaultValue: 'right',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
            { label: 'None', value: 'none' },
          ],
        },
      ],
    },
    {
      name: 'components',
      type: 'group',
      label: 'Available Components',
      fields: [
        {
          name: 'hero',
          type: 'checkbox',
          defaultValue: true,
          label: 'Hero Section',
        },
        {
          name: 'newsSlider',
          type: 'checkbox',
          defaultValue: true,
          label: 'News Slider',
        },
        {
          name: 'serviceCards',
          type: 'checkbox',
          defaultValue: true,
          label: 'Service Cards',
        },
        {
          name: 'statistics',
          type: 'checkbox',
          defaultValue: true,
          label: 'Statistics',
        },
        {
          name: 'gallery',
          type: 'checkbox',
          defaultValue: true,
          label: 'Gallery',
        },
        {
          name: 'contactForm',
          type: 'checkbox',
          defaultValue: true,
          label: 'Contact Form',
        },
      ],
    },
    {
      name: 'pages',
      type: 'array',
      label: 'Default Pages',
      admin: {
        description: 'Halaman yang akan dibuat otomatis saat template dipilih',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
        },
        {
          name: 'template',
          type: 'select',
          options: [
            { label: 'Home', value: 'home' },
            { label: 'About', value: 'about' },
            { label: 'Services', value: 'services' },
            { label: 'News', value: 'news' },
            { label: 'Contact', value: 'contact' },
            { label: 'Custom', value: 'custom' },
          ],
        },
      ],
    },
    {
      name: 'defaultColors',
      type: 'group',
      label: 'Default Color Scheme',
      fields: [
        {
          name: 'primary',
          type: 'text',
          label: 'Primary Color',
          defaultValue: '#0066CC',
          admin: {
            description: 'Hex color code',
          },
        },
        {
          name: 'secondary',
          type: 'text',
          label: 'Secondary Color',
          defaultValue: '#FF6600',
        },
        {
          name: 'accent',
          type: 'text',
          label: 'Accent Color',
          defaultValue: '#00CC66',
        },
      ],
    },
    {
      name: 'fonts',
      type: 'group',
      label: 'Typography',
      fields: [
        {
          name: 'headingFont',
          type: 'select',
          defaultValue: 'inter',
          options: [
            { label: 'Inter', value: 'inter' },
            { label: 'Poppins', value: 'poppins' },
            { label: 'Roboto', value: 'roboto' },
            { label: 'Montserrat', value: 'montserrat' },
            { label: 'Open Sans', value: 'open-sans' },
          ],
        },
        {
          name: 'bodyFont',
          type: 'select',
          defaultValue: 'inter',
          options: [
            { label: 'Inter', value: 'inter' },
            { label: 'Poppins', value: 'poppins' },
            { label: 'Roboto', value: 'roboto' },
            { label: 'Open Sans', value: 'open-sans' },
          ],
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      label: 'Template Features',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        position: 'sidebar',
        description: 'Apakah template tersedia untuk dipilih',
      },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      label: 'Default Template',
      admin: {
        position: 'sidebar',
        description: 'Template default untuk tenant type ini',
      },
    },
    {
      name: 'isPremium',
      type: 'checkbox',
      defaultValue: false,
      label: 'Premium Template',
      admin: {
        position: 'sidebar',
        description: 'Hanya tersedia untuk paket premium',
      },
    },
  ],
  timestamps: true,
}
