import type { Access } from 'payload'
import { requestIsAdmin } from '../lib/request-auth'

export const isAdmin: Access = ({ req }) => {
  return requestIsAdmin(req)
}