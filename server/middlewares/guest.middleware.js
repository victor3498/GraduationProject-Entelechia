import jwt from 'jsonwebtoken'

export const guestOnlyMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  // 没 token，说明未登录 → 放行
  if (!authHeader) {
    return next()
  }

  if (!authHeader.startsWith('Bearer ')) {
    return next()
  }

  const token = authHeader.split(' ')[1]

  try {
    // token 有效 → 已登录
    jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    return res.status(400).json({
      message: 'Already logged in',
    })
  } catch (err) {
    // token 无效 / 过期 → 当作未登录
    next()
  }
}


export const logoutMiddleware = (req, res, next) => {
  let refreshToken = null

  // 优先从 body 里取
  if (req.body && req.body.refreshToken) {
    refreshToken = req.body.refreshToken
  }

  // 其次从 header 里取（可选）
  if (!refreshToken && req.headers['x-refresh-token']) {
    refreshToken = req.headers['x-refresh-token']
  }

  // 其次从 cookie 里取（如果你以后用 HttpOnly）
  if (!refreshToken && req.cookies?.refreshToken) {
    refreshToken = req.cookies.refreshToken
  }

  // 统一挂载，controller 不再操心来源
  req.refreshToken = refreshToken

  next()
}


