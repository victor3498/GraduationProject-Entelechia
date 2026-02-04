import db from '../config/db.js'

/**
 * 获取用户上一次打开的文档 ID
 */
async function getLastOpenedDoc(userId) {
  const sql = `
    SELECT last_opened_doc_id
    FROM user_preferences
    WHERE user_id = $1
  `
  const { rows } = await db.query(sql, [userId])
  return rows[0] || null
}

/**
 * 更新（或插入）用户上一次打开的文档
 * 使用 UPSERT，保证一行一用户
 */
async function setLastOpenedDoc(userId, documentId) {
  const sql = `
    INSERT INTO user_preferences (user_id, last_opened_doc_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id)
    DO UPDATE SET last_opened_doc_id = EXCLUDED.last_opened_doc_id
    RETURNING user_id, last_opened_doc_id
  `
  const { rows } = await db.query(sql, [userId, documentId])
  return rows[0]
}

export default {
  getLastOpenedDoc,
  setLastOpenedDoc,
}
