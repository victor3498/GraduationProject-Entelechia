import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import * as controller from '../controllers/userPreference.controller.js'

const router = express.Router()

// 必须登录
router.use(authMiddleware)

// 获取上一次打开的文档
router.get('/last-opened', controller.getLastOpenedDoc)

// 记录上一次打开的文档
router.post('/last-opened', controller.setLastOpenedDoc)

export default router
