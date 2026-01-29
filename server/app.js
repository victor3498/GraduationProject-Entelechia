import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import routes from './routes/index.js'
import errorMiddleware from './middlewares/error.middleware.js'

const app = express()

// 基础中间件
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('dev'))

// 路由
app.use('/api', routes)

// 错误处理（必须最后）
app.use(errorMiddleware)

export default app
