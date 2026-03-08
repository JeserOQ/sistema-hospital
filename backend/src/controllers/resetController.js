const supabase = require('../supabase')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

const solicitarReset = async (req, res) => {
  const { email } = req.body

  const { data: personal, error } = await supabase
    .from('personal')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !personal) {
    return res.status(404).json({ error: 'No existe una cuenta con ese correo' })
  }

  const token = crypto.randomBytes(32).toString('hex')
  const expira = new Date(Date.now() + 3600000) // 1 hora

  await supabase.from('personal').update({
    reset_token: token,
    reset_token_expira: expira
  }).eq('id', personal.id)

  const enlace = `https://sistema-hospital-flame.vercel.app/reset-password/${token}`

  await transporter.sendMail({
    from: `"Sistema Hospital QR" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Recuperación de contraseña',
    html: `
      <h2>Recuperación de contraseña</h2>
      <p>Hola ${personal.nombre},</p>
      <p>Recibimos una solicitud para restablecer tu contraseña.</p>
      <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
      <a href="${enlace}" style="background:#2563eb;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">
        Restablecer contraseña
      </a>
      <p>Este enlace expira en 1 hora.</p>
      <p>Si no solicitaste este cambio, ignora este correo.</p>
    `
  })

  res.json({ mensaje: 'Correo enviado correctamente' })
}

const confirmarReset = async (req, res) => {
  const { token, password } = req.body

  const { data: personal, error } = await supabase
    .from('personal')
    .select('*')
    .eq('reset_token', token)
    .single()

  if (error || !personal) {
    return res.status(400).json({ error: 'Token inválido o expirado' })
  }

  if (new Date() > new Date(personal.reset_token_expira)) {
    return res.status(400).json({ error: 'El enlace ha expirado' })
  }

  const passwordEncriptada = await bcrypt.hash(password, 10)

  await supabase.from('personal').update({
    password: passwordEncriptada,
    reset_token: null,
    reset_token_expira: null
  }).eq('id', personal.id)

  res.json({ mensaje: 'Contraseña actualizada correctamente' })
}

module.exports = { solicitarReset, confirmarReset }