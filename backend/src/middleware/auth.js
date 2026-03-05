const jwt = require('jsonwebtoken')

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado, token requerido' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.personal = decoded
    next()
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado' })
  }
}

const verificarRol = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.personal.rol)) {
      return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' })
    }
    next()
  }
}

module.exports = { verificarToken, verificarRol }