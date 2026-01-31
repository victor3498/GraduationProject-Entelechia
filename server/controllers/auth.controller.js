import authService from '../services/auth.service.js'
import { success } from '../utils/response.js'

const register = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await authService.register(username, password)
    success(res, user)
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const result = await authService.login(username, password)
    success(res, result)
  } catch (err) {
    next(err)
  }
}

/**
 * 修改密码（需登录）
 * 假设你已有 JWT 中间件，把 user 挂在 req.user 上
 */
const changePassword = async (req, res, next) => {
  try {
    
    const { oldPassword, newPassword } = req.body
    const userId = req.user.id   // 来自 JWT

    await authService.changePassword(userId, oldPassword, newPassword)
    success(res)
  } catch (err) {
    next(err)
  }
}

const logout = async (req, res) => {
  // JWT 是无状态的，后端无需处理
  success(res)
}

export default {
  register,
  login,
  logout,
  changePassword
}