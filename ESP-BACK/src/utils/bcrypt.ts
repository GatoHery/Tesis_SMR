import { compare, hash } from 'bcryptjs'

export const encrypt = async (password: string): Promise<string> => {
  const passwordHash = await hash(password, 10)
  return passwordHash
}

export const verify = async (
  password: string,
  passwordHash: string
): Promise<boolean> => {
  const isCorrect = await compare(password, passwordHash)
  return isCorrect
}
