// src/controllers/document.controller.js
import documentService from '../services/document.service.js'
import { success } from '../utils/response.js'

/**
 * 新建文档
 */
export async function createDocument(req, res, next) {
  try {
    const userId = req.user.id
    const { title, content } = req.body

    const doc = await documentService.createDocument(
      userId,
      title,
      content
    )

    // res.json(doc)
    success(res,"create new document success",doc)
  } catch (err) {
    next(err)
  }
}

/**
 * 删除文档
 */
export async function deleteDocument(req, res, next) {
  try {
    const userId = req.user.id
    const documentId = req.params.id

    await documentService.deleteDocument(userId, documentId)

    // res.json({ success: true })
    success(res,"delete document success")
  } catch (err) {
    next(err)
  }
}

/**
 * 重命名文档
 */
export async function renameDocument(req, res, next) {
  try {
    const userId = req.user.id
    const documentId = req.params.id
    const { title } = req.body

    const result = await documentService.renameDocument(
      userId,
      documentId,
      title
    )

    // res.json(result)
    success(res,"rename document success",result)
  } catch (err) {
    next(err)
  }
}

/**
 * 保存 / 更新文档内容
 */
export async function saveDocumentContent(req, res, next) {
  try {
    const userId = req.user.id
    const documentId = req.params.id
    const { content } = req.body

    const result = await documentService.saveDocumentContent(
      userId,
      documentId,
      content
    )

    // res.json(result)
    success(res,"update/save document success",result)
  } catch (err) {
    next(err)
  }
}

/**
 * 获取文档列表
 */
export async function getDocumentList(req, res, next) {
  try {
    const userId = req.user.id
    const docs = await documentService.getDocumentList(userId)
    console.log(docs,userId)

    // res.json(docs)
    success(res,"get document list success",docs)
  } catch (err) {
    next(err)
  }
}

/**
 * 查询文档
 */
export async function queryDocuments(req, res, next) {
  try {
    const userId = req.user.id
    const {keyword,isStarred}=req.query
    const docs = await documentService.queryDocuments(userId, {
      keyword,
      isStarred:
        isStarred === undefined
          ? undefined
          : isStarred === 'true',
    })

    // res.json(docs)
    success(res,"query document success",docs)
  } catch (err) {
    next(err)
  }
}

/**
 * 获取文档详情
 */
export async function getDocumentDetail(req, res, next) {
  try {
    const userId = req.user.id
    const documentId = req.params.id
    const withContent = req.query.withContent !== 'false'

    const doc = await documentService.getDocumentDetail(
      userId,
      documentId,
      withContent
    )

    // res.json(doc)
    success(res,"get documentDetail success",doc)
  } catch (err) {
    next(err)
  }
}

/**
 * 星标 / 取消星标
 */
export async function toggleStar(req, res, next) {
  try {
    const userId = req.user.id
    const documentId = req.params.id
    const { isStarred } = req.body

    const result = await documentService.toggleStar(
      userId,
      documentId,
      isStarred
    )

    // res.json(result)
    success(res," start/not start success",result)
  } catch (err) {
    next(err)
  }
}
