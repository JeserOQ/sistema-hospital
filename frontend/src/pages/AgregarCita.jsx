import { useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { citasService } from '../services/api'
import { AuthContext } from '../context/AuthContext'

const AgregarCita = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { personal } = useContext(AuthContext)
  const [form, setForm] = useState({
    motivo_consulta: '', diagnostico: '', receta: '',
    presion_arterial: '', frecuencia_cardiaca: '',
    temperatura: '', saturacion_oxigeno: '', observaciones: ''
  })
  const [mensaje, setMensaje] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await citasService.create({
        ...form,
        estudiante_id: id,
        enfermero_id: personal.id
      })
      setMensaje('Cita registrada exitosamente')
      setTimeout(() => navigate(`/estudiante/${id}`), 1500)
    } catch (error) {
      setMensaje('Error al registrar la cita')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Registrar Cita Médica</h1>
          <button onClick={() => navigate(`/estudiante/${id}`)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            ← Atrás
          </button>
        </div>

        {personal && (
          <p className="text-gray-500 mb-4 text-sm">
            Atendido por: <span className="font-medium">{personal.nombre}</span>
          </p>
        )}

        {mensaje && (
          <div className={`p-4 rounded-lg mb-4 ${mensaje.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Información de la Consulta</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de consulta</label>
            <textarea name="motivo_consulta" value={form.motivo_consulta} onChange={handleChange} rows="2"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico</label>
            <textarea name="diagnostico" value={form.diagnostico} onChange={handleChange} rows="2"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Receta / Medicamentos</label>
            <textarea name="receta" value={form.receta} onChange={handleChange} rows="2"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Signos Vitales</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Presión arterial</label>
              <input type="text" name="presion_arterial" value={form.presion_arterial} onChange={handleChange}
                placeholder="Ej: 120/80"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia cardíaca</label>
              <input type="text" name="frecuencia_cardiaca" value={form.frecuencia_cardiaca} onChange={handleChange}
                placeholder="Ej: 80 bpm"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temperatura</label>
              <input type="text" name="temperatura" value={form.temperatura} onChange={handleChange}
                placeholder="Ej: 36.5"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Saturación de oxígeno</label>
              <input type="text" name="saturacion_oxigeno" value={form.saturacion_oxigeno} onChange={handleChange}
                placeholder="Ej: 98%"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones generales</label>
            <textarea name="observaciones" value={form.observaciones} onChange={handleChange} rows="3"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <button type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium mt-4">
            Registrar Cita
          </button>
        </form>
      </div>
    </div>
  )
}

export default AgregarCita