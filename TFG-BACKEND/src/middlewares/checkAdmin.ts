import { Request, Response, NextFunction } from 'express'
import { decodeToken } from '../utils/jwt'
import { User } from '../models/user'
import { Role } from '../models/role'

export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies['token']

    const decodedToken = decodeToken(token)

    if (!decodedToken) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // Get the user role from the decoded token
    const user = await User.findById(decodedToken.id)

    const userRole = user?.role

    // Find role by id
    const role = await Role.findById(userRole)

    // Check if the user role is not 'SUPER_ADMIN'
    if (role?.name !== 'SUPER_ADMIN') {
      return res
        .status(403)
        .json({ message: 'Forbidden, only SUPER_ADMIN allowed' })
    }

    next()
  } catch (error) {
    console.error('Error in checkAdmin middleware:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}