import { Request, Response } from 'express'
import {
  createRole,
  fetchAllRoles,
  fetchRoleById,
  deleteRole
} from '../services/role.services'

export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await fetchAllRoles()
    res.status(200).json(roles)
  } catch (error) {
    console.error('Error fetching roles:', error)
    res.status(500).json({ message: 'Error fetching roles' })
  }
}

export const getRoleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const role = await fetchRoleById(id)

    res.status(200).json(role)
  } catch (error) {
    console.error('Error fetching role:', error)
    res.status(500).json({ message: 'Error fetching role' })
  }
}

export const postRole = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body
    const newRole = await createRole({ name, description })
    res.status(201).json(newRole)
  } catch (error) {
    console.error('Error creating role:', error)
    res.status(500).json({ message: 'Error creating role' })
  }
}

export const deleteRoleCtrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deletedRole = await fetchRoleById(id)

    await deleteRole(id)
    res.status(200).json({ message: 'Role deleted successfully' })
  } catch (error) {
    console.error('Error deleting role:', error)
    res.status(500).json({ message: 'Error deleting role' })
  }
}
