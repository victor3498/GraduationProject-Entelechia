// src/services/document.service.js
import documentModel from '../models/document.model.js'


/**
 * 新建文档
 */
async function createDocument(userId, title = '未命名文档', content = {
   "type": "doc",
    "content": [
      {
        "type": "heading",
        "attrs": {
          "textAlign": null,
          "level": 1
        },
        "content": [
          {
            "type": "text",
            "text": "Getting started"
          }
        ]
      }
    ]
}) {
  return await documentModel.createDocument({
    userId,
    title,
    content,
  })
}

/**
 * 删除文档
 */
async function deleteDocument(userId, documentId) {
  const result = await documentModel.deleteDocument({userId, documentId})

  if (!result) {
    throw new Error('文档不存在或已删除')
  }

  return true
}

/**
 * 重命名文档
 */
async function renameDocument(userId, documentId, newTitle) {
  if (!newTitle || !newTitle.trim()) {
    throw new Error('文档标题不能为空')
  }

  const result = await documentModel.renameDocument({
    userId,
    documentId,
    title: newTitle.trim(),
  })

  if (!result) {
    throw new Error('文档不存在')
  }

  return result
}

/**
 * 保存 / 更新文档内容
 */
async function saveDocumentContent(userId, documentId, content) {
  if (!content) {
    throw new Error('文档内容不能为空')
  }

  const result = await documentModel.updateDocumentContent({
    userId,
    documentId,
    content,
  })

  if (!result) {
    throw new Error('文档不存在')
  }

  return result
}

/**
 * 获取文档列表（不含内容）
 */
async function getDocumentList(userId) {
  return await documentModel.getDocumentList({userId})
}

/**
 * 查询文档（搜索 / 星标）
 */
async function queryDocuments(userId, query) {
  return await documentModel.queryDocuments({
    userId,
    keyword: query.keyword,
    isStarred: query.isStarred,
  })
}

/**
 * 获取文档详情
 * @param withContent 是否包含 content
 */
async function getDocumentDetail(userId, documentId, withContent = true) {
  const doc = await documentModel.getDocumentById({
    userId,
    documentId,
    withContent}
  )

  if (!doc) {
    throw new Error('文档不存在')
  }

  return doc
}

/**
 * 星标 / 取消星标
 */
async function toggleStar(userId, documentId, isStarred) {
  const result = await documentModel.toggleStar({
    userId,
    documentId,
    isStarred,
  })

  if (!result) {
    throw new Error('文档不存在')
  }

  return result
}

export default {
  createDocument,
  deleteDocument,
  renameDocument,
  saveDocumentContent,
  getDocumentList,
  queryDocuments,
  getDocumentDetail,
  toggleStar,
}
