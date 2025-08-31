import { Request, Response } from 'express'
import { encrypt } from '../utils/bcrypt'
import { createUser, fetchAllUsers } from '../services/user.services'
import { Role } from '../models/role'
import { sendEmail } from '../utils/email'

export const getAllUsers = async (_: Request, res: Response) => {
  try {
    const users = await fetchAllUsers()
    res.status(200).json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ message: 'Error fetching users' })
  }
}

export const postUser = async ({ body }: Request, res: Response) => {
  try {
    const { name, email } = body

    // Generate 8 character password
    const password = Math.random().toString(36).slice(-8)

    const hashedPassword = await encrypt(password)

    let defaultRole = await Role.findOne({ name: 'ADMIN' })

    if (!defaultRole || !defaultRole._id) {
      return
    } 

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: defaultRole._id.toString()
    }

    await createUser(newUser)

    // Send email with credentials
    await sendEmail(
      email,
      'Se ha creado tu cuenta en el sistema de detección de la UCA',
      `Hola ${name},\n\nTu cuenta ha sido creada exitosamente.\n\nCredenciales:\nEmail: ${email}\nContraseña: ${password}\n\nTambién puedes iniciar sesión con Google o Microsoft.`
    )

    res.json({
      message: 'User created successfully',
      user: {
        name,
        email
      }
    })
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({ message: 'Error creating user' })
  }
}
