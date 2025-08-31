export interface User {
  name: string
  email: string
  receiveAlerts: boolean
  role: Role
  createdAt: string
  updatedAt: string
  uid: string
}

export interface Role {
  _id: string
  name: string
  __v: number
  createdAt: string
  updatedAt: string
}

export interface UserStats {
  totalUsers: number
  diffFromLastWeek: number
}
