import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { registrosService, pacientesService } from '../services/api'

const AgregarRegistro = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [paciente, setPaciente] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [form, setForm] = useState({
    tipo: '',
    descripcion: '',
    personal_id: ''
  })

  useEffect(() => {
    pacientesService.getById(id)
      .then(res => setPaciente(res.data))
      .catch(err => console.error(err))
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await registrosService.create({
        paciente_id: id,
        personal_id: form.personal_id,
        tipo: form.tipo,
        descripcion: form.descripcion
      })
      setMensaje('Registro agregado exitosamente')
      setTimeout(() => navigate(`/paciente/${id}`), 1500)
    } catch (error) {
      setMensaje('Error al agregar el registro')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Agregar Registro
        </h1>
        {paciente && (
          <p className="text-gray-500 mb-6">
            Paciente: <span className="font-medium text-gray-700">{paciente.nombre}</span>
          </p>
        )}
        {mensaje && (
          <div className={`p-4 rounded-lg mb-4 ${mensaje.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {mensaje}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID del Personal
            </label>
            <input
              type="text"
              name="personal_id"
              value={form.personal_id}
              onChange={handleChange}
              placeholder="UUID del personal que realiza el registro"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de registro
            </label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar...</option>
              <option value="diagnostico">Diagnóstico</option>
              <option value="medicamento">Medicamento</option>
              <option value="analisis">Análisis de laboratorio</option>
              <option value="signos_vitales">Signos vitales</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe detalladamente la actividad realizada..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Guardar Registro
            </button>
            <button
              type="button"
              onClick={() => navigate(`/paciente/${id}`)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AgregarRegistro