export const success = (res, data = null) => {
  res.json({
    code: 0,
    message: 'ok',
    data,
  })
}
