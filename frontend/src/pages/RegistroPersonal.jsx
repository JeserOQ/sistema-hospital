import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { personalService } from '../services/api'

const especialidades = [
  "Medicina General", "Cardiología", "Pediatría", "Ginecología y Obstetricia",
  "Cirugía General", "Ortopedia y Traumatología", "Neurología", "Psiquiatría",
  "Dermatología", "Oftalmología", "Otorrinolaringología", "Urología",
  "Oncología", "Endocrinología", "Gastroenterología", "Nefrología",
  "Neumología", "Reumatología", "Infectología", "Anestesiología",
  "Radiología e Imagen", "Medicina Interna", "Urgencias y Emergencias", "Otra"
]

const areasEnfermeria = [
  "Urgencias", "Terapia Intensiva (UCI)", "Quirófano", "Pediatría",
  "Ginecología y Obstetricia", "Neonatología", "Cardiología", "Neurología",
  "Oncología", "Ortopedia", "Medicina Interna", "Consulta Externa",
  "Hospitalización General", "Hemodiálisis", "Geriatría", "Otra"
]

const areasLaboratorio = [
  "Hematología", "Microbiología y Bacteriología", "Química Clínica",
  "Inmunología y Serología", "Banco de Sangre", "Uroanálisis",
  "Parasitología", "Biología Molecular", "Patología y Anatomía",
  "Citología", "Toxicología", "Endocrinología Clínica", "Otra"
]

const RegistroPersonal = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    email: '',
    rol: '',
    password: '',
    fecha_contratacion: '',
    // Doctor
    especialidad: '',
    especialidad_otra: '',
    cedula_profesional: '',
    horario: '',
    consultorio: '',
    // Enfermera
    turno: '',
    area: '',
    area_otra: '',
    // Laboratorio
    area_laboratorio: '',
    area_laboratorio_otra: '',
    // Administrativo / Directivo
    departamento: '',
    cargo: ''
  })
  const [mensaje, setMensaje] = useState('')
  const [errorCedula, setErrorCedula] = useState('')

  const toMayusculas = (value) => value.toUpperCase()

  const handleChange = (e) => {
    const { name, value } = e.target
    const camposTexto = ['nombres', 'apellido_paterno', 'apellido_materno']
    setForm({ ...form, [name]: camposTexto.includes(name) ? toMayusculas(value) : value })
  }

  const handleCedulaChange = (e) => {
    const value = e.target.value
    setErrorCedula('')
    if (!/^\d{0,8}$/.test(value)) {
      setErrorCedula('Solo se permiten números, máximo 8 dígitos')
      return
    }
    setForm({ ...form, cedula_profesional: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (['doctor', 'enfermera', 'laboratorio'].includes(form.rol) && form.cedula_profesional.length !== 8) {
      setErrorCedula('La cédula profesional debe tener exactamente 8 dígitos')
      return
    }

    const nombre = `${form.nombres} ${form.apellido_paterno} ${form.apellido_materno}`.trim()
    const especialidad = form.especialidad === 'Otra' ? form.especialidad_otra : form.especialidad
    const area = form.area === 'Otra' ? form.area_otra : form.area
    const area_laboratorio = form.area_laboratorio === 'Otra' ? form.area_laboratorio_otra : form.area_laboratorio

    try {
      await personalService.create({
        ...form,
        nombre,
        especialidad,
        area,
        area_laboratorio
      })
      setMensaje('Personal registrado exitosamente')
      setForm({
        nombres: '', apellido_paterno: '', apellido_materno: '',
        email: '', rol: '', password: '', fecha_contratacion: '',
        especialidad: '', especialidad_otra: '', cedula_profesional: '',
        horario: '', consultorio: '', turno: '', area: '', area_otra: '',
        area_laboratorio: '', area_laboratorio_otra: '', departamento: '', cargo: ''
      })
      setErrorCedula('')
    } catch (error) {
      setMensaje('Error al registrar el personal')
    }
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Registrar Personal</h1>
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

          {/* DATOS GENERALES */}
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Datos Generales</h2>

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
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={form.email}
              onChange={handleChange} required className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select name="rol" value={form.rol} onChange={handleChange} required className={inputClass}>
              <option value="">Seleccionar...</option>
              <option value="doctor">Doctor</option>
              <option value="enfermera">Enfermera</option>
              <option value="laboratorio">Laboratorio</option>
              <option value="administrativo">Administrativo</option>
              <option value="directivo">Directivo</option>
              <option value="enfermero_estudiantil">Enfermero Estudiantil</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input type="password" name="password" value={form.password}
              onChange={handleChange} required className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de contratación</label>
            <input type="date" name="fecha_contratacion" value={form.fecha_contratacion}
              onChange={handleChange} className={inputClass} />
          </div>

          {/* DOCTOR */}
          {form.rol === 'doctor' && (
            <>
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Datos del Doctor</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
                <select name="especialidad" value={form.especialidad} onChange={handleChange} className={inputClass}>
                  <option value="">Seleccionar especialidad...</option>
                  {especialidades.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              {form.especialidad === 'Otra' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Especificar especialidad</label>
                  <input type="text" name="especialidad_otra" value={form.especialidad_otra}
                    onChange={handleChange} placeholder="Escribir especialidad"
                    className={inputClass} />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cédula profesional</label>
                <input type="text" name="cedula_profesional" value={form.cedula_profesional}
                  onChange={handleCedulaChange} placeholder="8 dígitos numéricos"
                  maxLength={8} className={`${inputClass} ${errorCedula ? 'border-red-500' : ''}`} />
                {errorCedula && <p className="text-red-500 text-xs mt-1">{errorCedula}</p>}
                <p className="text-gray-400 text-xs mt-1">{form.cedula_profesional.length}/8 dígitos</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horario</label>
                <input type="text" name="horario" value={form.horario}
                  onChange={handleChange} placeholder="Ej: Lunes a Viernes 8am-4pm"
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consultorio</label>
                <input type="text" name="consultorio" value={form.consultorio}
                  onChange={handleChange} className={inputClass} />
              </div>
            </>
          )}

          {/* ENFERMERA */}
          {form.rol === 'enfermera' && (
            <>
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Datos de Enfermera</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
                <select name="turno" value={form.turno} onChange={handleChange} className={inputClass}>
                  <option value="">Seleccionar...</option>
                  <option value="mañana">Mañana</option>
                  <option value="tarde">Tarde</option>
                  <option value="noche">Noche</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                <select name="area" value={form.area} onChange={handleChange} className={inputClass}>
                  <option value="">Seleccionar área...</option>
                  {areasEnfermeria.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              {form.area === 'Otra' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Especificar área</label>
                  <input type="text" name="area_otra" value={form.area_otra}
                    onChange={handleChange} placeholder="Escribir área"
                    className={inputClass} />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cédula profesional</label>
                <input type="text" name="cedula_profesional" value={form.cedula_profesional}
                  onChange={handleCedulaChange} placeholder="8 dígitos numéricos"
                  maxLength={8} className={`${inputClass} ${errorCedula ? 'border-red-500' : ''}`} />
                {errorCedula && <p className="text-red-500 text-xs mt-1">{errorCedula}</p>}
                <p className="text-gray-400 text-xs mt-1">{form.cedula_profesional.length}/8 dígitos</p>
              </div>
            </>
          )}

          {/* LABORATORIO */}
          {form.rol === 'laboratorio' && (
            <>
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Datos de Laboratorio</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cédula profesional</label>
                <input type="text" name="cedula_profesional" value={form.cedula_profesional}
                  onChange={handleCedulaChange} placeholder="8 dígitos numéricos"
                  maxLength={8} className={`${inputClass} ${errorCedula ? 'border-red-500' : ''}`} />
                {errorCedula && <p className="text-red-500 text-xs mt-1">{errorCedula}</p>}
                <p className="text-gray-400 text-xs mt-1">{form.cedula_profesional.length}/8 dígitos</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
                <select name="turno" value={form.turno} onChange={handleChange} className={inputClass}>
                  <option value="">Seleccionar...</option>
                  <option value="mañana">Mañana</option>
                  <option value="tarde">Tarde</option>
                  <option value="noche">Noche</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Área de laboratorio</label>
                <select name="area_laboratorio" value={form.area_laboratorio} onChange={handleChange} className={inputClass}>
                  <option value="">Seleccionar área...</option>
                  {areasLaboratorio.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              {form.area_laboratorio === 'Otra' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Especificar área</label>
                  <input type="text" name="area_laboratorio_otra" value={form.area_laboratorio_otra}
                    onChange={handleChange} placeholder="Escribir área de laboratorio"
                    className={inputClass} />
                </div>
              )}
            </>
          )}

          {/* ADMINISTRATIVO */}
          {form.rol === 'administrativo' && (
            <>
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Datos Administrativos</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                <input type="text" name="departamento" value={form.departamento}
                  onChange={handleChange} placeholder="Ej: Recepción, Admisiones, etc."
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                <input type="text" name="cargo" value={form.cargo}
                  onChange={handleChange} placeholder="Ej: Recepcionista, Auxiliar administrativo, etc."
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                <input type="text" name="area" value={form.area}
                  onChange={handleChange} placeholder="Ej: Admisiones, Recursos Humanos, etc."
                  className={inputClass} />
              </div>
            </>
          )}

          {/* DIRECTIVO */}
          {form.rol === 'directivo' && (
            <>
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Datos del Directivo</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                <input type="text" name="cargo" value={form.cargo}
                  onChange={handleChange} placeholder="Ej: Director General, Subdirector Médico, etc."
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                <input type="text" name="departamento" value={form.departamento}
                  onChange={handleChange} placeholder="Ej: Dirección General, Dirección Médica, etc."
                  className={inputClass} />
              </div>
            </>
          )}

          {/* ENFERMERO ESTUDIANTIL */}
          {form.rol === 'enfermero_estudiantil' && (
            <>
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Datos del Enfermero Estudiantil</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cédula profesional</label>
                <input type="text" name="cedula_profesional" value={form.cedula_profesional}
                  onChange={handleCedulaChange} placeholder="8 dígitos numéricos"
                  maxLength={8} className={`${inputClass} ${errorCedula ? 'border-red-500' : ''}`} />
                {errorCedula && <p className="text-red-500 text-xs mt-1">{errorCedula}</p>}
                <p className="text-gray-400 text-xs mt-1">{form.cedula_profesional.length}/8 dígitos</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
                <select name="turno" value={form.turno} onChange={handleChange} className={inputClass}>
                  <option value="">Seleccionar...</option>
                  <option value="mañana">Mañana</option>
                  <option value="tarde">Tarde</option>
                  <option value="noche">Noche</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                <input type="text" name="area" value={form.area}
                  onChange={handleChange} placeholder="Ej: Consultorio universitario"
                  className={inputClass} />
              </div>
            </>
          )}

          <button type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium mt-4">
            Registrar Personal
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegistroPersonal