import type { CollectionConfig } from 'payload'

export const Sponsor: CollectionConfig = {
  slug: 'sponsor',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'website', 'orderRank'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'alt',
      type: 'text',
      admin: {
        description: 'Alt text for the logo (accessibility)',
      },
    },
    {
      name: 'website',
      type: 'text',
      admin: {
        description: 'Sponsor website URL',
      },
    },
    {
      name: 'orderRank',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Used for manual ordering (lexicographic)',
      },
    },
  ],
}
