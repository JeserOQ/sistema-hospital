const supabase = require('../supabase')

const getCitasByEstudiante = async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('citas_medicas')
    .select(`
      *,
      personal (nombre, rol)
    `)
    .eq('estudiante_id', id)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

const createCita = async (req, res) => {
  const {
    estudiante_id, enfermero_id,
    motivo_consulta, diagnostico, receta,
    presion_arterial, frecuencia_cardiaca,
    temperatura, saturacion_oxigeno, observaciones
  } = req.body

  const { data, error } = await supabase
    .from('citas_medicas')
    .insert([{
      estudiante_id, enfermero_id,
      motivo_consulta, diagnostico, receta,
      presion_arterial, frecuencia_cardiaca,
      temperatura, saturacion_oxigeno, observaciones
    }])
    .select()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data[0])
}

module.exports = { getCitasByEstudiante, createCita }