import { verifyToken } from '../utils/jwt.js'

export default (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const token = auth.split(' ')[1]

  try {
    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}
