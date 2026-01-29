// src/middlewares/error.middleware.js

export default function errorMiddleware(err, req, res, next) {
  console.error("Error caught by middleware:")
  console.error(err)

  const statusCode = err.statusCode || 500
  const message =
    err.message || "Internal Server Error"

  res.status(statusCode).json({
    success: false,
    message,
    // 仅在开发环境返回错误堆栈
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  })
}
