const supabase = require('../supabase')

// Obtener todos los pacientes
const getPacientes = async (req, res) => {
  const { data, error } = await supabase
    .from('pacientes')
    .select('*')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// Obtener un paciente por ID (para el QR)
const getPacienteById = async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('pacientes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return res.status(404).json({ error: 'Paciente no encontrado' })
  res.json(data)
}

// Crear un nuevo paciente
const createPaciente = async (req, res) => {
  const {
    nombre,
    fecha_nacimiento,
    tipo_sangre,
    alergias,
    diagnostico,
    cama,
    contacto_emergencia,
    telefono_emergencia
  } = req.body

  const { data, error } = await supabase
    .from('pacientes')
    .insert([{
      nombre,
      fecha_nacimiento,
      tipo_sangre,
      alergias,
      diagnostico,
      cama,
      contacto_emergencia,
      telefono_emergencia
    }])
    .select()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data[0])
}

// Actualizar un paciente
const updatePaciente = async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('pacientes')
    .update(req.body)
    .eq('id', id)
    .select()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
}

module.exports = {
  getPacientes,
  getPacienteById,
  createPaciente,
  updatePaciente
}