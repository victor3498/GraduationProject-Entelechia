import express from 'express'
import authRoutes from './auth.routes.js'
import docRoutes from './document.routes.js'
import userPreferenceRoutes from './userPreference.routes.js'
import shareRoutes from './share.routes.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/doc', docRoutes)
router.use('/user-preference', userPreferenceRoutes)
router.use('/share', shareRoutes)

export default router
