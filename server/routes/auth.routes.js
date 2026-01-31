import express from 'express'
import authController from '../controllers/auth.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import guestOnlyMiddleware from '../middlewares/guest.middleware.js'

const router = express.Router()

router.post('/register', authController.register)
router.post('/change-password', authMiddleware, authController.changePassword)
router.post('/login', guestOnlyMiddleware, authController.login)
router.post('/logout', authController.logout)

export default router
