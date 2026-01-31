//负责用户注册、登录的业务规则判断与安全控制
import userModel from '../models/user.model.js'
import { hashPassword, comparePassword } from '../utils/password.js'
import { signToken } from '../utils/jwt.js'

const register = async (username, password) => {
  const exist = await userModel.findByUsername(username)
  if (exist) {
    throw new Error('Username already exists')
  }

  const hashed = await hashPassword(password)

  const user = await userModel.createUser({
    username,
    password: hashed,
  })

  return user
}

const login = async (username, password) => {
  const user = await userModel.findByUsername(username)
  if (!user) {
    throw new Error('User not found')
  }

  const match = await comparePassword(password, user.password_hash)
  if (!match) {
    throw new Error('Invalid password')
  }

  const token = signToken({
    id: user.id,
    username: user.username,
  })

  return { token }
}

/**
 * 修改密码
 * @param userId 来自 JWT
 */
const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await userModel.findByUserId(userId)
  if (!user) {
    throw new Error('User not found')
  }

  const match = await comparePassword(oldPassword, user.password_hash)
  if (!match) {
    throw new Error('Old password is incorrect')
  }

  const newHashed = await hashPassword(newPassword)
  await userModel.updatePasswordById(user.id, newHashed)
}


export default {
  register,
  login,
  changePassword
}