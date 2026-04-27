import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { estudiantesService } from '../services/api'

const carreras = [
  "Ing. Química",
  "Ing. Civil",
  "Ing. Ambiental",
  "Ing. Industrial",
  "Ing. Petrolera",
  "Ing. Bioquímica",
  "Ing. Informática",
  "Lic. en Administración",
  "Ing. en Ciencia de Datos",
  "Ing. en Gestión Empresarial",
  "Ing. en Sistemas Computacionales"
]

const RegistroEstudiante = () => {
  const navigate = useNavigate()
  const [tipoMatricula, setTipoMatricula] = useState('normal')
  const [form, setForm] = useState({
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    matricula: '',
    carrera: '',
    semestre: '',
    fecha_nacimiento: '',
    tipo_sangre: '',
    alergias: '',
    contacto_nombres: '',
    contacto_apellido_paterno: '',
    contacto_apellido_materno: '',
    telefono_emergencia: ''
  })
  const [mensaje, setMensaje] = useState('')
  const [errorMatricula, setErrorMatricula] = useState('')

  const toMayusculas = (value) => value.toUpperCase()

  const handleChange = (e) => {
    const { name, value } = e.target
    const camposTexto = [
      'nombres', 'apellido_paterno', 'apellido_materno',
      'contacto_nombres', 'contacto_apellido_paterno', 'contacto_apellido_materno'
    ]
    setForm({ ...form, [name]: camposTexto.includes(name) ? toMayusculas(value) : value })
  }

  const handleMatriculaChange = (e) => {
    const value = e.target.value
    setErrorMatricula('')

    if (tipoMatricula === 'normal') {
      if (!/^\d{0,8}$/.test(value)) return
      setForm({ ...form, matricula: value })
    } else {
      if (!/^[a-zA-Z0-9]*$/.test(value)) {
        setErrorMatricula('Solo se permiten letras y números')
        return
      }
      if (!/[a-zA-Z]/.test(value) && value.length > 0) {
        setErrorMatricula('La matrícula de extranjero debe contener al menos una letra')
      }
      setForm({ ...form, matricula: value.toUpperCase() })
    }
  }

  const handleTipoMatricula = (tipo) => {
    setTipoMatricula(tipo)
    setForm({ ...form, matricula: '' })
    setErrorMatricula('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (tipoMatricula === 'normal' && form.matricula.length !== 8) {
      setErrorMatricula('La matrícula debe tener exactamente 8 dígitos')
      return
    }

    if (tipoMatricula === 'otro' && !/[a-zA-Z]/.test(form.matricula)) {
      setErrorMatricula('La matrícula de extranjero debe contener al menos una letra')
      return
    }

    const nombre = `${form.nombres} ${form.apellido_paterno} ${form.apellido_materno}`.trim()
    const contacto_emergencia = `${form.contacto_nombres} ${form.contacto_apellido_paterno} ${form.contacto_apellido_materno}`.trim()

    try {
      await estudiantesService.create({
        nombre,
        matricula: form.matricula,
        carrera: form.carrera,
        semestre: form.semestre,
        fecha_nacimiento: form.fecha_nacimiento,
        tipo_sangre: form.tipo_sangre,
        alergias: form.alergias,
        contacto_emergencia,
        telefono_emergencia: form.telefono_emergencia
      })
      setMensaje('Estudiante registrado exitosamente')
      setForm({
        nombres: '', apellido_paterno: '', apellido_materno: '',
        matricula: '', carrera: '', semestre: '', fecha_nacimiento: '',
        tipo_sangre: '', alergias: '', contacto_nombres: '',
        contacto_apellido_paterno: '', contacto_apellido_materno: '',
        telefono_emergencia: ''
      })
      setTipoMatricula('normal')
    } catch (error) {
      setMensaje('Error al registrar el estudiante')
    }
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

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

          {/* DATOS PERSONALES */}
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Datos Personales</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre(s)</label>
              <input type="text" name="nombres" value={form.nombres} onChange={handleChange} required
                placeholder="NOMBRE(S)"
                className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno</label>
              <input type="text" name="apellido_paterno" value={form.apellido_paterno} onChange={handleChange} required
                placeholder="APELLIDO PATERNO"
                className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
              <input type="text" name="apellido_materno" value={form.apellido_materno} onChange={handleChange}
                placeholder="APELLIDO MATERNO"
                className={inputClass} />
            </div>
          </div>

          {/* MATRÍCULA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Matrícula</label>
            <div className="flex gap-4 mb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="tipoMatricula" checked={tipoMatricula === 'normal'}
                  onChange={() => handleTipoMatricula('normal')}
                  className="accent-blue-600" />
                <span className="text-sm text-gray-700">Matrícula normal (8 dígitos)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="tipoMatricula" checked={tipoMatricula === 'otro'}
                  onChange={() => handleTipoMatricula('otro')}
                  className="accent-blue-600" />
                <span className="text-sm text-gray-700">Otro (estudiante extranjero)</span>
              </label>
            </div>
            <input
              type="text"
              value={form.matricula}
              onChange={handleMatriculaChange}
              required
              maxLength={tipoMatricula === 'normal' ? 8 : 20}
              placeholder={tipoMatricula === 'normal' ? 'Ej: 21340123' : 'Ej: ABC12345'}
              className={`${inputClass} ${errorMatricula ? 'border-red-500' : ''}`}
            />
            {errorMatricula && (
              <p className="text-red-500 text-xs mt-1">{errorMatricula}</p>
            )}
            {tipoMatricula === 'normal' && (
              <p className="text-gray-400 text-xs mt-1">{form.matricula.length}/8 dígitos</p>
            )}
          </div>

          {/* CARRERA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Carrera</label>
            <select name="carrera" value={form.carrera} onChange={handleChange} required className={inputClass}>
              <option value="">Seleccionar carrera...</option>
              {carreras.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* SEMESTRE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
            <input type="number" name="semestre" value={form.semestre} onChange={handleChange} min="1" max="12"
              className={inputClass} />
          </div>

          {/* FECHA NACIMIENTO */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
            <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange}
              className={inputClass} />
          </div>

          {/* TIPO DE SANGRE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de sangre</label>
            <select name="tipo_sangre" value={form.tipo_sangre} onChange={handleChange} className={inputClass}>
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

          {/* ALERGIAS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alergias</label>
            <input type="text" name="alergias" value={form.alergias} onChange={handleChange}
              placeholder="Ej: Penicilina, Polen, etc."
              className={inputClass} />
          </div>

          {/* CONTACTO DE EMERGENCIA */}
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Contacto de Emergencia</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre(s)</label>
              <input type="text" name="contacto_nombres" value={form.contacto_nombres} onChange={handleChange}
                placeholder="NOMBRE(S)"
                className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno</label>
              <input type="text" name="contacto_apellido_paterno" value={form.contacto_apellido_paterno} onChange={handleChange}
                placeholder="APELLIDO PATERNO"
                className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
              <input type="text" name="contacto_apellido_materno" value={form.contacto_apellido_materno} onChange={handleChange}
                placeholder="APELLIDO MATERNO"
                className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de emergencia</label>
            <input type="text" name="telefono_emergencia" value={form.telefono_emergencia} onChange={handleChange}
              className={inputClass} />
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