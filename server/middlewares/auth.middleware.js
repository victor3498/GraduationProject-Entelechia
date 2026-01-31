//验权中间件
import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  // 1. 是否携带 token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Not authenticated',
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    // 2. 校验 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 3. 挂载用户信息
    req.user = decoded

    next()
  } catch (err) {
    return res.status(401).json({
      message: 'Invalid or expired token',
    })
  }
}

export default authMiddleware
