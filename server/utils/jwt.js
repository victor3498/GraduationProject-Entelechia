//JWT工具
import jwt from 'jsonwebtoken'

// export const signToken = (payload) => {
//   return jwt.sign(payload, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   })
// }

export const signAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  })
}

export const signRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  })
}

// export const verifyToken = (token) => {
//   return jwt.verify(token, process.env.JWT_SECRET)
// }

export const verifyAccessToken = (Accesstoken) =>{
     return jwt.verify(Accesstoken, process.env.JWT_ACCESS_SECRET)
}

export const verifyRefreshToken = (Refreshtoken) =>{
     return jwt.verify(Refreshtoken, process.env.JWT_REFRESH_SECRET)
}

