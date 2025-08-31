import { CreateRoleInput } from '../interfaces/role.interfaces'
import { Role } from '../models/role'

export const fetchAllRoles = async () => {
  const roles = await Role.find()
  return roles
}

export const fetchRoleById = async (id: string) => {
  const role = await Role.findById(id)
  return role
}

export const createRole = async (roleData: CreateRoleInput) => {
  try {
    const newRole = new Role(roleData)
    return await newRole.save()
  } catch (error) {
    console.error('Error creating role:', error)
    throw new Error('Error creating role')
  }
}

export const deleteRole = async (id: string) => {
  try {
    const deletedRole = await Role.findByIdAndDelete(id)
    return deletedRole
  } catch (error) {
    console.error('Error deleting role:', error)
    throw new Error('Error deleting role')
  }
}
