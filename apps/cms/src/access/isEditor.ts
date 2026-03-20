import type { Access } from 'payload'
import { requestIsEditor } from '../lib/request-auth'

export const isEditor: Access = ({ req }) => {
  return requestIsEditor(req)
}