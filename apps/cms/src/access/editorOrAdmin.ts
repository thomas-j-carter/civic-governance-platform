import type { Access } from 'payload'
import { requestIsAdmin, requestIsEditor } from '../lib/request-auth'

export const editorOrAdmin: Access = ({ req }) => {
  return requestIsEditor(req) || requestIsAdmin(req)
}