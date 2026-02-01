export const success = (res, mes = "ok",data = null) => {
  res.json({
    code: 0,
    message: mes,
    data,
  })
}
