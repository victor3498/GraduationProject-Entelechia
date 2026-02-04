import express from 'express'
import authRoutes from './auth.routes.js'
import docRoutes from './document.routes.js'
import userPreferenceRoutes from './userPreference.routes.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/doc', docRoutes)
router.use('/user-preference', userPreferenceRoutes)

export default router
