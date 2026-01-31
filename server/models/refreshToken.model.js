import pool from '../config/db.js'

export const saveRefreshToken = async (userId, token, expiresAt) => {
  await pool.query(
    `
    INSERT INTO refresh_tokens (user_id, token, expires_at)
    VALUES ($1, $2, $3)
    `,
    [userId, token, expiresAt]
  )
}

export const findRefreshToken = async (token) => {
  const { rows } = await pool.query(
    `SELECT * FROM refresh_tokens WHERE token = $1`,
    [token]
  )
  return rows[0]
}

export const deleteRefreshToken = async (token) => {
  await pool.query(
    `DELETE FROM refresh_tokens WHERE token = $1`,
    [token]
  )
}

export const deleteUserRefreshTokens = async (userId) => {
  await pool.query(
    `DELETE FROM refresh_tokens WHERE user_id = $1`,
    [userId]
  )
}
