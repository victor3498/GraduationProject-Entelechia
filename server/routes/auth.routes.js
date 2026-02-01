import express from 'express'
import authController from '../controllers/auth.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import {guestOnlyMiddleware,logoutMiddleware} from '../middlewares/guest.middleware.js'//登出中间件本来该放auth那里的，但是放错位置了，就这样算了

const router = express.Router()

router.post('/register', authController.register)
router.post('/change-password', authMiddleware, authController.changePassword)
router.post('/login', guestOnlyMiddleware, authController.login)
router.post('/logout', logoutMiddleware,authController.logout)
router.post('/refresh', authController.refresh)

export default router
