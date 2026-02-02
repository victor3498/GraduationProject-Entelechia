// server/models/document.model.js
import db from '../config/db.js'

/**
 * 新建文档
 */
async function createDocument({ userId, title = '未命名文档', content }) {
  const sql = `
    INSERT INTO documents (user_id, title, content)
    VALUES ($1, $2, $3)
    RETURNING id, title, is_starred, created_at
  `
  const params = [userId, title, content]

  const { rows } = await db.query(sql, params)
  return rows[0]
}

/**
 * 删除文档
 */
async function deleteDocument({ userId, documentId }) {
  const sql = `
    DELETE FROM documents
    WHERE id = $1 AND user_id = $2
  `
  const { rowCount } = await db.query(sql, [documentId, userId])
  return rowCount > 0
}

/**
 * 重命名文档
 */
async function renameDocument({ userId, documentId, title }) {
  const sql = `
    UPDATE documents
    SET title = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2 AND user_id = $3
    RETURNING id, title, updated_at
  `
  const { rows } = await db.query(sql, [title, documentId, userId])
  return rows[0]
}

/**
 * 获取文档列表（不含 content）
 */
async function getDocumentList({ userId }) {
  const sql = `
    SELECT id, title, is_starred, created_at, updated_at
    FROM documents
    WHERE user_id = $1
    ORDER BY updated_at DESC
  `
  const { rows } = await db.query(sql, [userId])
  return rows
}

/**
 * 获取文档详情
 * @param withContent 是否返回 content
 */
async function getDocumentById({ userId, documentId, withContent = true }) {
  const fields = withContent
    ? 'id, title, content, is_starred, created_at, updated_at'
    : 'id, title, is_starred, created_at, updated_at'

  const sql = `
    SELECT ${fields}
    FROM documents
    WHERE id = $1 AND user_id = $2
  `
  const { rows } = await db.query(sql, [documentId, userId])
  return rows[0]
}

/**
 * 星标 / 取消星标
 */
async function toggleStar({ userId, documentId, isStarred }) {
  const sql = `
    UPDATE documents
    SET is_starred = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2 AND user_id = $3
    RETURNING id, is_starred, updated_at
  `
  const { rows } = await db.query(sql, [isStarred, documentId, userId])
  return rows[0]
}

/**
 * 保存 / 更新文档内容
 */
async function updateDocumentContent({ userId, documentId, content }) {
  const sql = `
    UPDATE documents
    SET content = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2 AND user_id = $3
    RETURNING id, updated_at
  `
  const { rows } = await db.query(sql, [content, documentId, userId])
  return rows[0]
}

/**
 * 查询文档（按条件）
 * 支持：标题模糊搜索 / 星标过滤
 */
async function queryDocuments({
  userId,
  keyword = '',
  isStarred,
}) {
  let sql = `
    SELECT id, title, is_starred, created_at, updated_at
    FROM documents
    WHERE user_id = $1
  `
  const params = [userId]
  let index = 2

  if (keyword) {
    sql += ` AND title ILIKE $${index}`
    params.push(`%${keyword}%`)
    index++
  }

  if (typeof isStarred === 'boolean') {
    sql += ` AND is_starred = $${index}`
    params.push(isStarred)
  }

  sql += ` ORDER BY updated_at DESC`

  const { rows } = await db.query(sql, params)
  return rows
}



export default {
  createDocument,
  deleteDocument,
  renameDocument,
  getDocumentList,
  getDocumentById,
  toggleStar,
  updateDocumentContent,
  queryDocuments
}
