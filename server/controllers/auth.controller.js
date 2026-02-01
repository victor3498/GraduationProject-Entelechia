import authService from '../services/auth.service.js'
import { success } from '../utils/response.js'
import jwt from 'jsonwebtoken'
import { signAccessToken} from '../utils/jwt.js'
import * as refreshTokenModel from '../models/refreshToken.model.js'

const register = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await authService.register(username, password)
    success(res,"register success", user)
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const result = await authService.login(username, password)
    success(res, "login success",result)
  } catch (err) {
    next(err)
  }
}
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body //应该refresh token 放在 HttpOnly Cookie
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' })
    }

    // 1️校验 refresh token 签名
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    )

    // 2️校验 refresh token 是否存在于数据库
    const record = await refreshTokenModel.findRefreshToken(refreshToken)
    if (!record || record.expires_at < new Date()) {
      return res.status(401).json({ message: 'Invalid refresh token or Refresh token expired' })
    }

    // 3️签发新的 access token
    const newAccessToken = signAccessToken({
      id: decoded.id,
      username: decoded.username,
    })

    success(res, "refresh success",{ accessToken: newAccessToken })
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
    success(res,"changePassword success")
  } catch (err) {
    next(err)
  }
}

// const logout = async (req, res) => {
//   // JWT 是无状态的，后端无需处理
//   success(res)
// }
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (refreshToken) {
      await refreshTokenModel.deleteRefreshToken(refreshToken)
    }
    success(res,"logout")
  } catch (err) {
    next(err)
  }
}


export default {
  register,
  login,
  refresh,
  changePassword,
  logout,
}