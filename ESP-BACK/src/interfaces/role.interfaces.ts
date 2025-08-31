export interface Role {
  _id: string
  name: string
  description?: string
}

export type CreateRoleInput = Omit<Role, '_id'>
