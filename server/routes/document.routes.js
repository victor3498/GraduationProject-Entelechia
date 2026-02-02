// routes/document.routes.js
import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import * as controller from '../controllers/document.controller.js'

const router = express.Router()

// 所有文档接口必须登录
router.use(authMiddleware)

router.post('/', controller.createDocument)
router.get('/', controller.getDocumentList)
router.get('/search', controller.queryDocuments)
router.get('/:id', controller.getDocumentDetail)

router.put('/:id/content', controller.saveDocumentContent)
router.patch('/:id/title', controller.renameDocument)
router.patch('/:id/star', controller.toggleStar)
router.delete('/:id', controller.deleteDocument)

export default router