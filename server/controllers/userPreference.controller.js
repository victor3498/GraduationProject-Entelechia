import userPreferenceService from '../services/userPreference.service.js'
import { success } from '../utils/response.js'

/**
 * 获取上一次打开的文档
 */
export async function getLastOpenedDoc(req, res, next) {
  try {
    const userId = req.user.id

    const docId = await userPreferenceService.getLastOpenedDocument(userId)

    success(res, 'get last opened document success', {
      lastOpenedDocId: docId,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * 记录本次打开的文档
 */
export async function setLastOpenedDoc(req, res, next) {
  try {
    const userId = req.user.id
    const { documentId } = req.body

    const result =
      await userPreferenceService.recordLastOpenedDocument(
        userId,
        documentId
      )

    success(res, 'record last opened document success', result)
  } catch (err) {
    next(err)
  }
}
