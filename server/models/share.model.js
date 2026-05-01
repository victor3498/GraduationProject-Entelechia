// server/models/share.model.js
import db from '../config/db.js'

/**
 * 创建一条分享记录。
 * 调用方需保证：
 *   1. 文档归属校验已在 service 层完成；
 *   2. share_code 由 service 层生成并保证全局唯一（重试机制由 service 兜底）。
 */
async function createShare({ documentId, shareCode, permission }) {
  const sql = `
    INSERT INTO document_shares (document_id, share_code, permission)
    VALUES ($1, $2, $3)
    RETURNING id, document_id, share_code, permission, is_active, created_at
  `
  const { rows } = await db.query(sql, [documentId, shareCode, permission])
  return rows[0]
}

/**
 * 取某文档某权限当前生效的分享记录。
 * 用于实现「同权限再次生成 → 直接返回旧记录」的幂等。
 */
async function getActiveShareByDocAndPerm({ documentId, permission }) {
  const sql = `
    SELECT id, document_id, share_code, permission, is_active, created_at
    FROM document_shares
    WHERE document_id = $1
      AND permission  = $2
      AND is_active   = true
    LIMIT 1
  `
  const { rows } = await db.query(sql, [documentId, permission])
  return rows[0]
}

/**
 * 列出某文档当前生效的所有分享记录（最多两条：view + edit）。
 * 仅当 documentId 属于 userId 时才返回，避免越权读取。
 */
async function listActiveSharesByDoc({ documentId, userId }) {
  const sql = `
    SELECT s.id, s.document_id, s.share_code, s.permission,
           s.is_active, s.created_at
    FROM document_shares s
    INNER JOIN documents d ON d.id = s.document_id
    WHERE s.document_id = $1
      AND d.user_id     = $2
      AND s.is_active   = true
    ORDER BY s.permission ASC
  `
  const { rows } = await db.query(sql, [documentId, userId])
  return rows
}

/**
 * 通过 share_code 查询生效记录 + 联表带出文档信息。
 * 不带文档归属过滤：公开访问场景下需要拿到文档内容。
 */
async function getActiveByCode(shareCode) {
  const sql = `
    SELECT s.id            AS share_id,
           s.share_code,
           s.permission,
           s.is_active,
           s.created_at    AS share_created_at,
           d.id            AS doc_id,
           d.title,
           d.content,
           d.is_starred,
           d.created_at    AS doc_created_at,
           d.updated_at    AS doc_updated_at
    FROM document_shares s
    INNER JOIN documents d ON d.id = s.document_id
    WHERE s.share_code = $1
      AND s.is_active  = true
    LIMIT 1
  `
  const { rows } = await db.query(sql, [shareCode])
  return rows[0]
}

/**
 * 撤销（软删除）一条分享记录。
 * 通过联表 documents.user_id 校验「只有所有者能撤销」。
 * 返回受影响行数：0 表示不存在 / 不属于该用户 / 已撤销。
 */
async function revokeShareByCode({ shareCode, documentId, userId }) {
  const sql = `
    UPDATE document_shares s
    SET is_active = false,
        revoked_at = CURRENT_TIMESTAMP
    FROM documents d
    WHERE s.document_id = d.id
      AND s.share_code  = $1
      AND s.document_id = $2
      AND d.user_id     = $3
      AND s.is_active   = true
  `
  const { rowCount } = await db.query(sql, [shareCode, documentId, userId])
  return rowCount > 0
}

/**
 * 通过分享码更新文档内容。
 * 仅当 share_code 对应记录 is_active=true 且 permission='edit' 时生效。
 * 返回 { id, updated_at } 或 undefined（无权限 / 失效 / 不存在）。
 */
async function updateContentByShareCode({ shareCode, content }) {
  const sql = `
    UPDATE documents d
    SET content    = $2,
        updated_at = CURRENT_TIMESTAMP
    FROM document_shares s
    WHERE s.document_id = d.id
      AND s.share_code  = $1
      AND s.is_active   = true
      AND s.permission  = 'edit'
    RETURNING d.id, d.updated_at
  `
  const { rows } = await db.query(sql, [shareCode, content])
  return rows[0]
}

/**
 * 校验某文档归属该用户。用于 controller / service 层鉴权。
 */
async function isDocumentOwner({ documentId, userId }) {
  const sql = `SELECT 1 FROM documents WHERE id = $1 AND user_id = $2`
  const { rowCount } = await db.query(sql, [documentId, userId])
  return rowCount > 0
}

export default {
  createShare,
  getActiveShareByDocAndPerm,
  listActiveSharesByDoc,
  getActiveByCode,
  revokeShareByCode,
  updateContentByShareCode,
  isDocumentOwner,
}
