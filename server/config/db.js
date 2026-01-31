import { Pool } from "pg"


/**
 * PostgreSQL 连接池
 */
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  idleTimeoutMillis: 30000 // 空闲连接超时
})


console.log("DB_HOST =", process.env.DB_HOST)

pool.on("connect", () => {
  console.log(" PostgreSQL connected-数据库连接")
})

pool.on("error", (err) => {
  console.error("PostgreSQL pool error-失败", err)
  process.exit(1)
})

/**
 * 基础查询方法（推荐业务层使用）
 */
async function query(text, params = []) {
  try {
    return await pool.query(text, params)
  } catch (err) {
    console.error(" PostgreSQL query error")
    console.error("SQL:", text)
    console.error("Params:", params)
    throw err
  }
}

export default {
  query,
  pool, // 可选暴露（事务 / 高级操作用）
}

//后面全项目只用 db.query()