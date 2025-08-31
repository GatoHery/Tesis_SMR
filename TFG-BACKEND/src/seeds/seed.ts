import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { Role } from '../models/role'
import { User } from '../models/user'
import { encrypt } from '../utils/bcrypt'

const seed = async () => {
  try {
    await mongoose.connect('mongodb://mongo:27017/ESP-back')

    console.log('✅ Conectado a MongoDB')

    const existingRoles = await Role.find({})
    if (existingRoles.length === 0) {
      await Role.insertMany([{ name: 'ADMIN' }, { name: 'SUPER_ADMIN' }])
      console.log('✅ Roles creados')
    } else {
      console.log('ℹ️ Los roles ya existen, no se crearon nuevos.')
    }

    const adminEmail = process.env.ADMIN_EMAIL
    const existingAdmin = await User.findOne({ email: adminEmail })

    if (!existingAdmin) {
      if (!process.env.ADMIN_PASSWORD) {
        throw new Error(
          'ADMIN_PASSWORD is not defined in environment variables'
        )
      }
      const adminPassword = await encrypt(process.env.ADMIN_PASSWORD)

      const adminRole = await Role.findOne({ name: 'SUPER_ADMIN' })

      const adminUser = new User({
        name: 'SUPER_ADMIN',
        email: adminEmail,
        password: adminPassword,
        role: adminRole?._id
      })

      await adminUser.save()

      console.log('✅ Usuario Super Admin creado')
    } else {
      console.log('ℹ️ El usuario Super Admin ya existe, no se creó uno nuevo.')
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Error en el seed:', error)
    process.exit(1)
  }
}

seed()
