import type { Access } from 'payload'
import { requestIsAuthenticated } from '../lib/request-auth'

export const isAuthenticated: Access = ({ req }) => {
  return requestIsAuthenticated(req)
}