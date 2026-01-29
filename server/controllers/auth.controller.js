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

const logout = async (req, res) => {
  // JWT 是无状态的，后端无需处理
  success(res)
}

export default {
  register,
  login,
  logout,
}