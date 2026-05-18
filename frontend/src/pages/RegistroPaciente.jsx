import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { pacientesService } from '../services/api'

const RegistroPaciente = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    fecha_nacimiento: '',
    tipo_sangre: '',
    alergias: '',
    diagnostico: '',
    cama: '',
    parentesco: '',
    parentesco_otro: '',
    contacto_nombres: '',
    contacto_apellido_paterno: '',
    contacto_apellido_materno: '',
    telefono_emergencia: ''
  })
  const [mensaje, setMensaje] = useState('')

  const toMayusculas = (value) => value.toUpperCase()

  const handleChange = (e) => {
    const { name, value } = e.target
    const camposTexto = [
      'nombres', 'apellido_paterno', 'apellido_materno',
      'contacto_nombres', 'contacto_apellido_paterno', 'contacto_apellido_materno'
    ]
    setForm({ ...form, [name]: camposTexto.includes(name) ? toMayusculas(value) : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nombre = `${form.nombres} ${form.apellido_paterno} ${form.apellido_materno}`.trim()
    const parentesco = form.parentesco === 'Otro' ? form.parentesco_otro : form.parentesco
    const contacto_emergencia = `${parentesco ? `(${parentesco}) ` : ''}${form.contacto_nombres} ${form.contacto_apellido_paterno} ${form.contacto_apellido_materno}`.trim()

    try {
      await pacientesService.create({
        nombre,
        fecha_nacimiento: form.fecha_nacimiento,
        tipo_sangre: form.tipo_sangre,
        alergias: form.alergias,
        diagnostico: form.diagnostico,
        cama: form.cama,
        contacto_emergencia,
        telefono_emergencia: form.telefono_emergencia
      })
      setMensaje('Paciente registrado exitosamente')
      setForm({
        nombres: '', apellido_paterno: '', apellido_materno: '',
        fecha_nacimiento: '', tipo_sangre: '', alergias: '',
        diagnostico: '', cama: '', parentesco: '', parentesco_otro: '',
        contacto_nombres: '', contacto_apellido_paterno: '',
        contacto_apellido_materno: '', telefono_emergencia: ''
      })
    } catch (error) {
      setMensaje('Error al registrar el paciente')
    }
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Registrar Nuevo Paciente</h1>
          <button onClick={() => navigate('/')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            ← Inicio
          </button>
        </div>

        {mensaje && (
          <div className={`p-4 rounded-lg mb-4 ${mensaje.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* DATOS DEL PACIENTE */}
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Datos del Paciente</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre(s)</label>
              <input type="text" name="nombres" value={form.nombres}
                onChange={handleChange} required placeholder="NOMBRE(S)"
                className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno</label>
              <input type="text" name="apellido_paterno" value={form.apellido_paterno}
                onChange={handleChange} required placeholder="APELLIDO PATERNO"
                className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
              <input type="text" name="apellido_materno" value={form.apellido_materno}
                onChange={handleChange} placeholder="APELLIDO MATERNO"
                className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
            <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento}
              onChange={handleChange} required className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de sangre</label>
            <select name="tipo_sangre" value={form.tipo_sangre}
              onChange={handleChange} className={inputClass}>
              <option value="">Seleccionar...</option>
              <option>A+</option><option>A-</option>
              <option>B+</option><option>B-</option>
              <option>AB+</option><option>AB-</option>
              <option>O+</option><option>O-</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alergias</label>
            <input type="text" name="alergias" value={form.alergias}
              onChange={handleChange} placeholder="Ej: Penicilina, Polen, etc."
              className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico</label>
            <textarea name="diagnostico" value={form.diagnostico}
              onChange={handleChange} rows="2" className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cama</label>
            <input type="text" name="cama" value={form.cama}
              onChange={handleChange} className={inputClass} />
          </div>

          {/* CONTACTO DE EMERGENCIA */}
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Contacto de Emergencia</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parentesco</label>
            <select name="parentesco" value={form.parentesco}
              onChange={handleChange} className={inputClass}>
              <option value="">Seleccionar parentesco...</option>
              <option value="Papá">Papá</option>
              <option value="Mamá">Mamá</option>
              <option value="Hermano">Hermano</option>
              <option value="Hermana">Hermana</option>
              <option value="Abuelo">Abuelo</option>
              <option value="Abuela">Abuela</option>
              <option value="Tío">Tío</option>
              <option value="Tía">Tía</option>
              <option value="Cónyuge">Cónyuge</option>
              <option value="Hijo">Hijo</option>
              <option value="Hija">Hija</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {form.parentesco === 'Otro' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Especificar parentesco</label>
              <input type="text" name="parentesco_otro" value={form.parentesco_otro}
                onChange={handleChange} placeholder="Ej: Tutor, Amigo, etc."
                className={inputClass} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre(s)</label>
              <input type="text" name="contacto_nombres" value={form.contacto_nombres}
                onChange={handleChange} placeholder="NOMBRE(S)"
                className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno</label>
              <input type="text" name="contacto_apellido_paterno" value={form.contacto_apellido_paterno}
                onChange={handleChange} placeholder="APELLIDO PATERNO"
                className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
              <input type="text" name="contacto_apellido_materno" value={form.contacto_apellido_materno}
                onChange={handleChange} placeholder="APELLIDO MATERNO"
                className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de emergencia</label>
            <input type="text" name="telefono_emergencia" value={form.telefono_emergencia}
              onChange={handleChange} className={inputClass} />
          </div>

          <button type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">
            Registrar Paciente
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegistroPaciente