import express from 'express'
import authRoutes from './auth.routes.js'
import docRoutes from './document.routes.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/doc', docRoutes)

export default router
