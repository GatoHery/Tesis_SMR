import { UserCreate } from '../interfaces/user.interface'
import { User } from '../models/user'

export const fetchAllUsers = async () => {
  const users = await User.find().populate('role')

  return users
}

export const getUserStats = async () => {
  const totalUsers = await User.countDocuments()

  const now = new Date()
  const day = now.getDay() // 0 (domingo) a 6 (sábado)
  const diffToMonday = (day + 6) % 7
  const mondayThisWeek = new Date(now)
  mondayThisWeek.setDate(now.getDate() - diffToMonday)
  mondayThisWeek.setHours(0, 0, 0, 0)

  const mondayLastWeek = new Date(mondayThisWeek)
  mondayLastWeek.setDate(mondayThisWeek.getDate() - 7)

  const usersLastWeek = await User.countDocuments({
    createdAt: { $gte: mondayLastWeek, $lt: mondayThisWeek }
  })

  const usersThisWeek = await User.countDocuments({
    createdAt: { $gte: mondayThisWeek }
  })

  const diff = usersThisWeek - usersLastWeek

  return {
    totalUsers,
    diffFromLastWeek: diff
  }
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
