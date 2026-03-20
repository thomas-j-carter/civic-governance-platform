import type { CollectionConfig } from 'payload'
import { editorOrAdmin } from '../access/editorOrAdmin'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true,
    create: editorOrAdmin,
    update: editorOrAdmin,
    delete: editorOrAdmin,
  },
  admin: {
    useAsTitle: 'title',
  },
  versions: {
    drafts: true,
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
      unique: true,
    },
    {
      name: 'summary',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'content',
      type: 'richText',
    },
  ],
}