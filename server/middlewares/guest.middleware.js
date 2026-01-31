import jwt from 'jsonwebtoken'

const guestOnlyMiddleware = (req, res, next) => {
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

export default guestOnlyMiddleware
