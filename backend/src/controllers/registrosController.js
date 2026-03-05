const supabase = require('../supabase')

// Obtener todos los registros de un paciente
const getRegistrosByPaciente = async (req, res) => {
  const { pacienteId } = req.params

  const { data, error } = await supabase
    .from('registros')
    .select(`
      *,
      personal (nombre, rol)
    `)
    .eq('paciente_id', pacienteId)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// Crear un nuevo registro de actividad
const createRegistro = async (req, res) => {
  const {
    paciente_id,
    personal_id,
    tipo,
    descripcion
  } = req.body

  const { data, error } = await supabase
    .from('registros')
    .insert([{
      paciente_id,
      personal_id,
      tipo,
      descripcion
    }])
    .select()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data[0])
}

// Obtener registros por tipo (medicamento, diagnostico, etc)
const getRegistrosByTipo = async (req, res) => {
  const { pacienteId, tipo } = req.params

  const { data, error } = await supabase
    .from('registros')
    .select(`
      *,
      personal (nombre, rol)
    `)
    .eq('paciente_id', pacienteId)
    .eq('tipo', tipo)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

module.exports = {
  getRegistrosByPaciente,
  createRegistro,
  getRegistrosByTipo
}