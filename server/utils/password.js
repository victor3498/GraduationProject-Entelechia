//密码工具
import bcrypt from '../node_modules/bcrypt/bcrypt.js'

const SALT_ROUNDS = 10

export const hashPassword = (password) => {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash)
}