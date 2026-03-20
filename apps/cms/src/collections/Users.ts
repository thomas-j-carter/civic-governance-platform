import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'displayName',
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      required: true,
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Editor', value: 'editor' },
        { label: 'Admin', value: 'admin' },
        { label: 'Founder', value: 'founder' },
      ],
    },
  ],
}