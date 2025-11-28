import type { CollectionConfig } from 'payload'

export const ContactPage: CollectionConfig = {
  slug: 'contact-page',
  admin: {
    useAsTitle: 'heroTitle',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heroTitle',
      type: 'text',
      required: true,
      maxLength: 120,
    },
    {
      name: 'heroIntro',
      type: 'textarea',
      required: true,
      maxLength: 240,
    },
    {
      name: 'teamEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'sponsorTab',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'formHeading',
          type: 'text',
          required: true,
        },
        {
          name: 'formSubtitle',
          type: 'textarea',
          required: true,
        },
        {
          name: 'highlights',
          type: 'array',
          minRows: 1,
          maxRows: 6,
          fields: [
            {
              name: 'highlight',
              type: 'textarea',
            },
          ],
        },
      ],
    },
    {
      name: 'joinTab',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'formHeading',
          type: 'text',
          required: true,
        },
        {
          name: 'formSubtitle',
          type: 'textarea',
          required: true,
        },
        {
          name: 'meetings',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'time',
              type: 'text',
              required: true,
            },
            {
              name: 'location',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'highlights',
          type: 'array',
          minRows: 1,
          maxRows: 8,
          fields: [
            {
              name: 'highlight',
              type: 'textarea',
            },
          ],
        },
      ],
    },
  ],
}
