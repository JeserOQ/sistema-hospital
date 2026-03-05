const supabase = require('../supabase')
const bcrypt = require('bcryptjs')

// Obtener todo el personal
const getPersonal = async (req, res) => {
  const { data, error } = await supabase
    .from('personal')
    .select('*')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// Obtener un miembro del personal por ID
const getPersonalById = async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('personal')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return res.status(404).json({ error: 'Personal no encontrado' })
  res.json(data)
}

// Crear un nuevo miembro del personal
const createPersonal = async (req, res) => {
  const {
    nombre,
    email,
    rol,
    password,
    fecha_contratacion,
    // Datos especificos segun rol
    especialidad,
    cedula_profesional,
    horario,
    consultorio,
    turno,
    area,
    area_laboratorio,
    departamento,
    cargo
  } = req.body

// Encriptar contraseña
  const passwordEncriptada = await bcrypt.hash(password, 10)

  const { data: personalData, error: personalError } = await supabase
    .from('personal')
    .insert([{ nombre, email, rol, password: passwordEncriptada, fecha_contratacion }])
    .select()

  // Luego insertamos en la tabla especifica segun el rol
  if (rol === 'doctor') {
    await supabase.from('doctores').insert([{
      personal_id: personalId,
      especialidad,
      cedula_profesional,
      horario,
      consultorio
    }])
  } else if (rol === 'enfermera') {
    await supabase.from('enfermeras').insert([{
      personal_id: personalId,
      turno,
      area,
      cedula_profesional
    }])
  } else if (rol === 'laboratorio') {
    await supabase.from('laboratorio').insert([{
      personal_id: personalId,
      cedula_profesional,
      turno,
      area_laboratorio
    }])
  } else if (rol === 'administrativo') {
    await supabase.from('administrativos').insert([{
      personal_id: personalId,
      departamento,
      cargo,
      area
    }])
  }

  res.status(201).json(personalData[0])
}

// Obtener personal con sus datos especificos segun rol
const getPersonalCompleto = async (req, res) => {
  const { id } = req.params

  // Primero obtenemos los datos principales
  const { data: personalData, error } = await supabase
    .from('personal')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return res.status(404).json({ error: 'Personal no encontrado' })

  let datosEspecificos = null

  // Luego buscamos en la tabla especifica segun su rol
  if (personalData.rol === 'doctor') {
    const { data } = await supabase
      .from('doctores')
      .select('*')
      .eq('personal_id', id)
      .single()
    datosEspecificos = data
  } else if (personalData.rol === 'enfermera') {
    const { data } = await supabase
      .from('enfermeras')
      .select('*')
      .eq('personal_id', id)
      .single()
    datosEspecificos = data
  } else if (personalData.rol === 'laboratorio') {
    const { data } = await supabase
      .from('laboratorio')
      .select('*')
      .eq('personal_id', id)
      .single()
    datosEspecificos = data
  } else if (personalData.rol === 'administrativo') {
    const { data } = await supabase
      .from('administrativos')
      .select('*')
      .eq('personal_id', id)
      .single()
    datosEspecificos = data
  }

  // Combinamos los datos principales con los especificos
  res.json({ ...personalData, ...datosEspecificos })
}

module.exports = {
  getPersonal,
  getPersonalById,
  createPersonal,
  getPersonalCompleto
}