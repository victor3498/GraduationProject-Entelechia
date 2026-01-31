import pool from '../config/db.js'

const findByUsername = async (username) =>{
    const { rows } = await pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  )
  return rows[0] 
}

const findByUserId = async (userId) =>{
    const { rows } = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  )
  return rows[0] 
}

const createUser = async ({ username, password }) => {
  const { rows } = await pool.query(
    `
    INSERT INTO users (username, password_hash)
    VALUES ($1, $2)
    RETURNING id, username
    `,
    [username, password]
  )
  return rows[0]
}

const updatePasswordById = async (userId, newHashedPassword) => {
  await pool.query(
    `
    UPDATE users
    SET password_hash = $1
    WHERE id = $2
    `,
    [newHashedPassword, userId]
  )
}

export default {
  findByUsername,
  findByUserId,
  createUser,
  updatePasswordById,
}