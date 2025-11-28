import type { CollectionConfig } from 'payload'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'description'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
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
          name: 'caption',
          type: 'text',
          admin: {
            description: 'Optional caption for the image',
          },
        },
      ],
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
