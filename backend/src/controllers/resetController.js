const supabase = require('../supabase')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { Resend } = require('resend')


const solicitarReset = async (req, res) => {
  const resend = new Resend(process.env.RESEND_API_KEY)
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
  const expira = new Date(Date.now() + 3600000)

  await supabase.from('personal').update({
    reset_token: token,
    reset_token_expira: expira
  }).eq('id', personal.id)

  const enlace = `https://sistema-hospital-flame.vercel.app/reset-password/${token}`

  const { data, error: resendError } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Recuperación de contraseña - Sistema Hospital QR',
    html: `
      <h2>Recuperación de contraseña</h2>
      <p>Hola ${personal.nombre},</p>
      <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
      <a href="${enlace}" style="background:#2563eb;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;display:inline-block;margin:10px 0;">
        Restablecer contraseña
      </a>
      <p>Este enlace expira en 1 hora.</p>
    `
  })

  if (resendError) {
    console.error('Error Resend:', resendError)
    return res.status(500).json({ error: 'Error al enviar el correo: ' + resendError.message })
  }
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