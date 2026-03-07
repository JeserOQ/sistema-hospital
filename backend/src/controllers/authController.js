const supabase = require('../supabase')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const login = async (req, res) => {
  const { email, password } = req.body

  const { data: personal, error } = await supabase
    .from('personal')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !personal) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos' })
  }

  const passwordValida = await bcrypt.compare(password, personal.password)

  if (!passwordValida) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos' })
  }

  const token = jwt.sign(
    { id: personal.id, nombre: personal.nombre, email: personal.email, rol: personal.rol },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  )

  res.json({
    token,
    personal: { id: personal.id, nombre: personal.nombre, email: personal.email, rol: personal.rol }
  })
}

const registro = async (req, res) => {
  const { nombre, email, rol, password, fecha_contratacion,
    especialidad, cedula_profesional, horario, consultorio,
    turno, area, area_laboratorio, departamento, cargo } = req.body

  const passwordEncriptada = await bcrypt.hash(password, 10)

  const { data: personalData, error: personalError } = await supabase
    .from('personal')
    .insert([{ nombre, email, rol, password: passwordEncriptada, fecha_contratacion }])
    .select()

  if (personalError) return res.status(500).json({ error: personalError.message })

  const personalId = personalData[0].id

  let tablaError = null

  if (rol === 'doctor') {
    const { error } = await supabase.from('doctores').insert([{
      id_doctor: personalId, especialidad, cedula_profesional, horario, consultorio
    }])
    tablaError = error
  } else if (rol === 'enfermera') {
    const { error } = await supabase.from('enfermeras').insert([{
      id_enfermera: personalId, turno, area, cedula_profesional
    }])
    tablaError = error
  } else if (rol === 'laboratorio') {
    const { error } = await supabase.from('laboratorio').insert([{
      id_lab: personalId, cedula_profesional, turno, area_laboratorio
    }])
    tablaError = error
  } else if (rol === 'administrativo') {
    const { error } = await supabase.from('administrativos').insert([{
      id_admin: personalId, departamento, cargo, area
    }])
    tablaError = error
  }

  if (tablaError) {
    return res.status(500).json({ 
      error: 'Personal creado pero error en tabla específica: ' + tablaError.message 
    })
  }

  res.status(201).json(personalData[0])
}

module.exports = { login, registro }