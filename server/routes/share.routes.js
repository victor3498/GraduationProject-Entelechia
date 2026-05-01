// server/routes/share.routes.js
// 公开路由：通过 share_code 访问 / 保存分享文档，无需登录鉴权。
import express from 'express'
import * as shareController from '../controllers/share.controller.js'

const router = express.Router()

router.get('/:code', shareController.getSharedDoc)
router.put('/:code/content', shareController.saveSharedDocContent)

export default router
