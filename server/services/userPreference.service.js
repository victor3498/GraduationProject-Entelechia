import userPreferenceModel from '../models/userPreference.model.js'

/**
 * 查询用户上一次打开的文档
 */
async function getLastOpenedDocument(userId) {
  const result = await userPreferenceModel.getLastOpenedDoc(userId)
  return result?.last_opened_doc_id || null
}

/**
 * 记录用户打开的文档
 */
async function recordLastOpenedDocument(userId, documentId) {
  if (!documentId) {
    throw new Error('documentId 不能为空')
  }

  return await userPreferenceModel.setLastOpenedDoc(userId, documentId)
}

export default {
  getLastOpenedDocument,
  recordLastOpenedDocument,
}
