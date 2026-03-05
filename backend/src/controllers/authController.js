const supabase = require('../supabase')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const login = async (req, res) => {
  const { email, password } = req.body

  // Buscar el personal por email
  const { data: personal, error } = await supabase
    .from('personal')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !personal) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos' })
  }

  // Verificar la contraseña
  const passwordValida = await bcrypt.compare(password, personal.password)

  if (!passwordValida) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos' })
  }

  // Generar el token JWT
  const token = jwt.sign(
    {
      id: personal.id,
      nombre: personal.nombre,
      email: personal.email,
      rol: personal.rol
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  )

  res.json({
    token,
    personal: {
      id: personal.id,
      nombre: personal.nombre,
      email: personal.email,
      rol: personal.rol
    }
  })
}

const registro = async (req, res) => {
  const { nombre, email, rol, password, fecha_contratacion,
    especialidad, cedula_profesional, horario, consultorio,
    turno, area, area_laboratorio, departamento, cargo } = req.body

  // Encriptar la contraseña antes de guardarla
  const passwordEncriptada = await bcrypt.hash(password, 10)

  // Insertar en tabla principal
  const { data: personalData, error: personalError } = await supabase
    .from('personal')
    .insert([{ nombre, email, rol, password: passwordEncriptada, fecha_contratacion }])
    .select()

  if (personalError) return res.status(500).json({ error: personalError.message })

  const personalId = personalData[0].id

  // Insertar en tabla específica según rol
  if (rol === 'doctor') {
    await supabase.from('doctores').insert([{
      personal_id: personalId, especialidad, cedula_profesional, horario, consultorio
    }])
  } else if (rol === 'enfermera') {
    await supabase.from('enfermeras').insert([{
      personal_id: personalId, turno, area, cedula_profesional
    }])
  } else if (rol === 'laboratorio') {
    await supabase.from('laboratorio').insert([{
      personal_id: personalId, cedula_profesional, turno, area_laboratorio
    }])
  } else if (rol === 'administrativo') {
    await supabase.from('administrativos').insert([{
      personal_id: personalId, departamento, cargo, area
    }])
  }

  res.status(201).json(personalData[0])
}

module.exports = { login, registro }