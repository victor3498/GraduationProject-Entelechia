// server/controllers/share.controller.js
import shareService from '../services/share.service.js'
import { success } from '../utils/response.js'

/**
 * [需登录 + 所有者] 生成 / 复用某文档某权限的分享码（幂等）。
 * 路由：POST /api/doc/:id/share
 * Body：{ permission: 'view' | 'edit' }
 */
export async function createShare(req, res, next) {
  try {
    const userId = req.user.id
    const documentId = Number(req.params.id)
    const { permission } = req.body

    const record = await shareService.createOrGetShare({
      userId,
      documentId,
      permission,
    })

    success(res, 'create share success', {
      shareCode: record.share_code,
      permission: record.permission,
      createdAt: record.created_at,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * [需登录 + 所有者] 列出某文档当前生效的全部分享记录（最多 view + edit 两条）。
 * 路由：GET /api/doc/:id/shares
 */
export async function listShares(req, res, next) {
  try {
    const userId = req.user.id
    const documentId = Number(req.params.id)

    const rows = await shareService.listShares({ userId, documentId })
    const data = rows.map((r) => ({
      shareCode: r.share_code,
      permission: r.permission,
      createdAt: r.created_at,
    }))
    success(res, 'list shares success', data)
  } catch (err) {
    next(err)
  }
}

/**
 * [需登录 + 所有者] 撤销某条分享。
 * 路由：DELETE /api/doc/:id/share/:code
 */
export async function revokeShare(req, res, next) {
  try {
    const userId = req.user.id
    const documentId = Number(req.params.id)
    const shareCode = req.params.code

    const result = await shareService.revokeShare({
      userId,
      documentId,
      shareCode,
    })
    success(res, 'revoke share success', result)
  } catch (err) {
    next(err)
  }
}

/**
 * [公开] 通过分享码获取分享文档详情。
 * 路由：GET /api/share/:code
 */
export async function getSharedDoc(req, res, next) {
  try {
    const shareCode = req.params.code
    const data = await shareService.getSharedDoc(shareCode)
    success(res, 'get shared doc success', data)
  } catch (err) {
    next(err)
  }
}

/**
 * [公开 + 仅 edit 权限] 通过分享码保存文档内容。
 * 路由：PUT /api/share/:code/content
 * Body：{ content }
 */
export async function saveSharedDocContent(req, res, next) {
  try {
    const shareCode = req.params.code
    const { content } = req.body
    const data = await shareService.saveSharedDocContent({
      shareCode,
      content,
    })
    success(res, 'save shared doc success', data)
  } catch (err) {
    next(err)
  }
}
