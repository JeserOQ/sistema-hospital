import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { estudiantesService } from '../services/api'

const RegistroEstudiante = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombre: '', matricula: '', carrera: '', semestre: '',
    fecha_nacimiento: '', tipo_sangre: '', alergias: '',
    contacto_emergencia: '', telefono_emergencia: ''
  })
  const [mensaje, setMensaje] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await estudiantesService.create(form)
      setMensaje('Estudiante registrado exitosamente')
      setForm({
        nombre: '', matricula: '', carrera: '', semestre: '',
        fecha_nacimiento: '', tipo_sangre: '', alergias: '',
        contacto_emergencia: '', telefono_emergencia: ''
      })
    } catch (error) {
      setMensaje('Error al registrar el estudiante')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Registrar Estudiante</h1>
          <button onClick={() => navigate('/estudiantes')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            ← Atrás
          </button>
        </div>

        {mensaje && (
          <div className={`p-4 rounded-lg mb-4 ${mensaje.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Datos Personales</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula</label>
            <input type="text" name="matricula" value={form.matricula} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Carrera</label>
            <input type="text" name="carrera" value={form.carrera} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
            <input type="number" name="semestre" value={form.semestre} onChange={handleChange} min="1" max="12"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
            <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de sangre</label>
            <select name="tipo_sangre" value={form.tipo_sangre} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Seleccionar...</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alergias</label>
            <input type="text" name="alergias" value={form.alergias} onChange={handleChange}
              placeholder="Ej: Penicilina, Polen, etc."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Contacto de Emergencia</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del contacto</label>
            <input type="text" name="contacto_emergencia" value={form.contacto_emergencia} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de emergencia</label>
            <input type="text" name="telefono_emergencia" value={form.telefono_emergencia} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <button type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium mt-4">
            Registrar Estudiante
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegistroEstudiante