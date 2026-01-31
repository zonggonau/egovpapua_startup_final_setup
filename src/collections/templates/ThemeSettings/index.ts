import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { tenantAccess } from '@/access/tenantAccess'

export const ThemeSettings: CollectionConfig = {
  slug: 'theme-settings',
  access: {
    create: authenticated,
    read: tenantAccess,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'tenant',
    defaultColumns: ['tenant', 'template', 'updatedAt'],
    group: 'Template System',
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      unique: true,
      label: 'Tenant',
      admin: {
        description: 'One theme setting per tenant',
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
      name: 'template',
      type: 'relationship',
      relationTo: 'templates',
      required: true,
      label: 'Selected Template',
      admin: {
        description: 'Template yang digunakan tenant ini',
      },
    },
    {
      name: 'colors',
      type: 'group',
      label: 'Color Customization',
      fields: [
        {
          name: 'primary',
          type: 'text',
          label: 'Primary Color',
          admin: {
            description: 'Hex color code (e.g., #0066CC)',
          },
        },
        {
          name: 'secondary',
          type: 'text',
          label: 'Secondary Color',
        },
        {
          name: 'accent',
          type: 'text',
          label: 'Accent Color',
        },
        {
          name: 'background',
          type: 'text',
          label: 'Background Color',
        },
        {
          name: 'text',
          type: 'text',
          label: 'Text Color',
        },
      ],
    },
    {
      name: 'logo',
      type: 'group',
      label: 'Logo Settings',
      fields: [
        {
          name: 'main',
          type: 'upload',
          relationTo: 'media',
          label: 'Main Logo',
        },
        {
          name: 'alternate',
          type: 'upload',
          relationTo: 'media',
          label: 'Alternate Logo',
          admin: {
            description: 'Logo untuk dark mode atau header transparan',
          },
        },
        {
          name: 'favicon',
          type: 'upload',
          relationTo: 'media',
          label: 'Favicon',
        },
        {
          name: 'width',
          type: 'number',
          label: 'Logo Width (px)',
          defaultValue: 150,
        },
      ],
    },
    {
      name: 'header',
      type: 'group',
      label: 'Header Settings',
      fields: [
        {
          name: 'style',
          type: 'select',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Centered', value: 'centered' },
            { label: 'Minimal', value: 'minimal' },
            { label: 'Full Width', value: 'full-width' },
          ],
        },
        {
          name: 'isSticky',
          type: 'checkbox',
          defaultValue: true,
          label: 'Sticky Header',
        },
        {
          name: 'isTransparent',
          type: 'checkbox',
          defaultValue: false,
          label: 'Transparent on Homepage',
        },
        {
          name: 'showSearch',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Search',
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      label: 'Footer Settings',
      fields: [
        {
          name: 'style',
          type: 'select',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Minimal', value: 'minimal' },
            { label: 'Extended', value: 'extended' },
          ],
        },
        {
          name: 'copyrightText',
          type: 'text',
          label: 'Copyright Text',
        },
        {
          name: 'showSocialMedia',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Social Media',
        },
      ],
    },
    {
      name: 'homepage',
      type: 'group',
      label: 'Homepage Settings',
      fields: [
        {
          name: 'heroType',
          type: 'select',
          defaultValue: 'slider',
          options: [
            { label: 'Slider', value: 'slider' },
            { label: 'Video', value: 'video' },
            { label: 'Image', value: 'image' },
            { label: 'Minimal', value: 'minimal' },
          ],
        },
        {
          name: 'heroImages',
          type: 'array',
          label: 'Hero Images/Slides',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'subtitle',
              type: 'text',
            },
            {
              name: 'link',
              type: 'text',
            },
          ],
        },
        {
          name: 'sections',
          type: 'array',
          label: 'Homepage Sections',
          admin: {
            description: 'Atur urutan section di homepage',
          },
          fields: [
            {
              name: 'type',
              type: 'select',
              required: true,
              options: [
                { label: 'Latest News', value: 'news' },
                { label: 'Services', value: 'services' },
                { label: 'Statistics', value: 'statistics' },
                { label: 'Gallery', value: 'gallery' },
                { label: 'Agenda', value: 'agenda' },
                { label: 'Quick Links', value: 'quick-links' },
                { label: 'Contact', value: 'contact' },
              ],
            },
            {
              name: 'title',
              type: 'text',
              label: 'Section Title',
            },
            {
              name: 'isVisible',
              type: 'checkbox',
              defaultValue: true,
              label: 'Visible',
            },
          ],
        },
      ],
    },
    {
      name: 'typography',
      type: 'group',
      label: 'Typography',
      fields: [
        {
          name: 'headingFont',
          type: 'select',
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
          options: [
            { label: 'Inter', value: 'inter' },
            { label: 'Poppins', value: 'poppins' },
            { label: 'Roboto', value: 'roboto' },
            { label: 'Open Sans', value: 'open-sans' },
          ],
        },
        {
          name: 'fontSize',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
          ],
        },
      ],
    },
    {
      name: 'customCSS',
      type: 'code',
      label: 'Custom CSS',
      admin: {
        language: 'css',
        description: 'Custom CSS untuk styling tambahan',
      },
    },
    {
      name: 'customJS',
      type: 'code',
      label: 'Custom JavaScript',
      admin: {
        language: 'javascript',
        description: 'Custom JavaScript (gunakan dengan hati-hati)',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Default Meta Title',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Default Meta Description',
          maxLength: 160,
        },
        {
          name: 'metaImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Default OG Image',
        },
        {
          name: 'googleAnalyticsId',
          type: 'text',
          label: 'Google Analytics ID',
          admin: {
            description: 'Format: G-XXXXXXXXXX',
          },
        },
      ],
    },
  ],
  timestamps: true,
}
