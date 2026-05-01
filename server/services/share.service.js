// server/services/share.service.js
import crypto from 'crypto'
import shareModel from '../models/share.model.js'

const ALLOWED_PERMISSIONS = new Set(['view', 'edit'])
const SHARE_CODE_LEN = 12
const MAX_RETRY = 3

/**
 * 生成一个 12 位 base64url 风格的 share_code，仅包含 [A-Za-z0-9_-]。
 * 用 Node 内置 crypto，无需引入新依赖。
 */
function generateShareCode() {
  return crypto.randomBytes(9).toString('base64url').slice(0, SHARE_CODE_LEN)
}

function makeError(message, statusCode) {
  const err = new Error(message)
  err.statusCode = statusCode
  return err
}

/**
 * 生成 / 复用一条分享记录（幂等）。
 * 如果同 (documentId, permission) 已存在生效记录 → 直接返回；
 * 否则插入新记录，并对 share_code 唯一冲突最多重试 MAX_RETRY 次。
 */
async function createOrGetShare({ userId, documentId, permission }) {
  if (!ALLOWED_PERMISSIONS.has(permission)) {
    throw makeError('permission must be "view" or "edit"', 400)
  }

  const isOwner = await shareModel.isDocumentOwner({ documentId, userId })
  if (!isOwner) {
    throw makeError('Document not found or no permission', 404)
  }

  const existing = await shareModel.getActiveShareByDocAndPerm({
    documentId,
    permission,
  })
  if (existing) return existing

  let lastErr
  for (let i = 0; i < MAX_RETRY; i++) {
    const shareCode = generateShareCode()
    try {
      return await shareModel.createShare({
        documentId,
        shareCode,
        permission,
      })
    } catch (err) {
      // PG 唯一冲突 errcode 23505：share_code 或 (document_id, permission) 重复
      if (err && err.code === '23505') {
        lastErr = err
        // 若是 (document_id, permission) 冲突，再次尝试拉一次现有记录
        const dup = await shareModel.getActiveShareByDocAndPerm({
          documentId,
          permission,
        })
        if (dup) return dup
        continue
      }
      throw err
    }
  }
  throw lastErr || makeError('Failed to create share code', 500)
}

/**
 * 列出某文档当前生效的全部分享记录（最多 2 条）。
 */
async function listShares({ userId, documentId }) {
  const isOwner = await shareModel.isDocumentOwner({ documentId, userId })
  if (!isOwner) {
    throw makeError('Document not found or no permission', 404)
  }
  return shareModel.listActiveSharesByDoc({ documentId, userId })
}

/**
 * 撤销一条分享记录。
 */
async function revokeShare({ userId, documentId, shareCode }) {
  const ok = await shareModel.revokeShareByCode({
    shareCode,
    documentId,
    userId,
  })
  if (!ok) {
    throw makeError('Share link not found or revoked', 404)
  }
  return { revoked: true }
}

/**
 * 通过 share_code 获取分享文档详情（公开接口）。
 * 出于安全考虑：失效 / 不存在统一返回 404，不区分。
 */
async function getSharedDoc(shareCode) {
  if (!shareCode) {
    throw makeError('Share link not found or revoked', 404)
  }
  const row = await shareModel.getActiveByCode(shareCode)
  if (!row) {
    throw makeError('Share link not found or revoked', 404)
  }
  return {
    docId: row.doc_id,
    title: row.title,
    content: row.content,
    isStarred: row.is_starred,
    createdAt: row.doc_created_at,
    updatedAt: row.doc_updated_at,
    permission: row.permission,
    shareCode: row.share_code,
  }
}

/**
 * 通过 share_code 保存文档内容（公开接口）。
 * 仅 permission=edit 才允许；其余情况一律 403 / 404。
 */
async function saveSharedDocContent({ shareCode, content }) {
  if (content === undefined || content === null) {
    throw makeError('content is required', 400)
  }
  // 先查权限：避免无效 code 时直接 PUT 不知所以
  const row = await shareModel.getActiveByCode(shareCode)
  if (!row) {
    throw makeError('Share link not found or revoked', 404)
  }
  if (row.permission !== 'edit') {
    throw makeError('This share link is read-only', 403)
  }
  const result = await shareModel.updateContentByShareCode({
    shareCode,
    content,
  })
  if (!result) {
    throw makeError('Share link not found or revoked', 404)
  }
  return {
    docId: result.id,
    updatedAt: result.updated_at,
  }
}

export default {
  createOrGetShare,
  listShares,
  revokeShare,
  getSharedDoc,
  saveSharedDocContent,
}
