import type { CollectionConfig } from 'payload'

export const TeamMember: CollectionConfig = {
  slug: 'team-member',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'orderRank'],
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'alt',
      type: 'text',
      admin: {
        description: 'Alt text for the image (accessibility)',
      },
    },
    {
      name: 'role',
      type: 'text',
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
