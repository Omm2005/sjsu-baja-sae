import type { GlobalConfig } from 'payload'

export const HomeAbout: GlobalConfig = {
    slug: 'home-about',
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            defaultValue: 'Who are we?',
        },
        {
            name: 'description',
            type: 'textarea',
            required: true,
            admin: {
                description: 'Plain text content for the TextReveal animation on the homepage',
            },
        },
        {
            name: 'linkText',
            type: 'text',
            required: true,
            defaultValue: 'Learn More',
            admin: {
                description: 'Text displayed on the call-to-action button',
            },
        },
        {
            name: 'linkPage',
            type: 'relationship',
            relationTo: 'about-page',
            required: false,
            admin: {
                description: 'Select which About Page to link to',
            },
        },
    ],
}
