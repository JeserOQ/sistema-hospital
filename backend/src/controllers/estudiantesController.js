const supabase = require('../supabase')

const getEstudiantes = async (req, res) => {
  const { data, error } = await supabase
    .from('estudiantes')
    .select('*')
    .order('nombre')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

const getEstudianteById = async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('estudiantes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return res.status(404).json({ error: 'Estudiante no encontrado' })
  res.json(data)
}

const createEstudiante = async (req, res) => {
  const {
    nombre, matricula, carrera, semestre,
    fecha_nacimiento, tipo_sangre, alergias,
    contacto_emergencia, telefono_emergencia
  } = req.body

  const { data, error } = await supabase
    .from('estudiantes')
    .insert([{
      nombre, matricula, carrera, semestre,
      fecha_nacimiento, tipo_sangre, alergias,
      contacto_emergencia, telefono_emergencia
    }])
    .select()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data[0])
}

module.exports = { getEstudiantes, getEstudianteById, createEstudiante }