import { UserCreate } from '../interfaces/user.interface'
import { User } from '../models/user'

export const fetchAllUsers = async () => {
  const users = await User.find().populate('role')

  return users
}

export const getUserById = async (id: string) => {
  const user = await User.findById(id).populate('role')
  return user
}

export const createUser = async (data: UserCreate) => {
  try {
    const newUser = new User(data)
    await newUser.save()
  } catch (error) {
    console.error('Error creating user: ', error)
    throw new Error('Error creating user')
  }
}
