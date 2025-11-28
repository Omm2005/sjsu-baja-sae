import type { GlobalConfig } from 'payload'

export const FooterGlobal: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'pages',
      label: 'Page Links',
      type: 'array',
      labels: {
        singular: 'Page link',
        plural: 'Page links',
      },
      defaultValue: [
        { label: 'About', href: '/#about', external: false },
        { label: 'Team', href: '/#team', external: false },
        { label: 'Sponsors', href: '/', external: false },
      ],
      fields: [
        {
          name: 'label',
          label: 'Label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          label: 'Link',
          type: 'text',
          required: true,
        },
        {
          name: 'external',
          label: 'Open in new tab',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'social',
      label: 'Social Links',
      type: 'array',
      labels: {
        singular: 'Social link',
        plural: 'Social links',
      },
      defaultValue: [
        { label: 'Twitter', href: 'https://twitter.com', platform: 'x' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com', platform: 'linkedin' },
        { label: 'GitHub', href: 'https://github.com', platform: 'github' },
      ],
      fields: [
        {
          name: 'label',
          label: 'Label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          label: 'Link',
          type: 'text',
          required: true,
        },
        {
          name: 'platform',
          label: 'Platform',
          type: 'select',
          required: true,
          defaultValue: 'x',
          options: [
            { label: 'X (Twitter)', value: 'x' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'GitHub', value: 'github' },
            { label: 'Custom (no icon)', value: 'custom' },
          ],
        },
      ],
    },
  ],
}
