import pool from '../config/db.js'

const findByUsername = async (username) =>{
    const { rows } = await pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
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

export default {
  findByUsername,
  createUser,
}