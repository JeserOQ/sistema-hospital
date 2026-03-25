import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { personalService } from '../services/api'

const RegistroPersonal = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    rol: '',
    password: '',
    fecha_contratacion: '',
    // Doctor
    especialidad: '',
    cedula_profesional: '',
    horario: '',
    consultorio: '',
    // Enfermera
    turno: '',
    area: '',
    // Laboratorio
    area_laboratorio: '',
    // Administrativo
    departamento: '',
    cargo: ''
  })
  const [mensaje, setMensaje] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await personalService.create(form)
      setMensaje('Personal registrado exitosamente')
      setForm({
        nombre: '', email: '', rol: '', password: '',
        fecha_contratacion: '', especialidad: '', cedula_profesional: '',
        horario: '', consultorio: '', turno: '', area: '',
        area_laboratorio: '', departamento: '', cargo: ''
      })
    } catch (error) {
      setMensaje('Error al registrar el personal')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Registrar Personal</h1>
          <button
            onClick={() => navigate('/')}
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

          {/* Datos generales */}
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Datos Generales</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input
              type="text" name="nombre" value={form.nombre}
              onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" name="email" value={form.email}
              onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select
              name="rol" value={form.rol}
              onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
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
            <input
              type="password" name="password" value={form.password}
              onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de contratación</label>
            <input
              type="date" name="fecha_contratacion" value={form.fecha_contratacion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Campos específicos para Doctor */}
          {form.rol === 'doctor' && (
            <>
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Datos del Doctor</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
                <input type="text" name="especialidad" value={form.especialidad} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cédula profesional</label>
                <input type="text" name="cedula_profesional" value={form.cedula_profesional} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horario</label>
                <input type="text" name="horario" value={form.horario} onChange={handleChange}
                  placeholder="Ej: Lunes a Viernes 8am-4pm"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consultorio</label>
                <input type="text" name="consultorio" value={form.consultorio} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </>
          )}

          {/* Campos específicos para Enfermera */}
          {form.rol === 'enfermera' && (
            <>
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Datos de Enfermera</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
                <select name="turno" value={form.turno} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Seleccionar...</option>
                  <option value="mañana">Mañana</option>
                  <option value="tarde">Tarde</option>
                  <option value="noche">Noche</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                <input type="text" name="area" value={form.area} onChange={handleChange}
                  placeholder="Ej: Urgencias, Pediatría, etc."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cédula profesional</label>
                <input type="text" name="cedula_profesional" value={form.cedula_profesional} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </>
          )}

          {/* Campos específicos para Laboratorio */}
          {form.rol === 'laboratorio' && (
            <>
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Datos de Laboratorio</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cédula profesional</label>
                <input type="text" name="cedula_profesional" value={form.cedula_profesional} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
                <select name="turno" value={form.turno} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Seleccionar...</option>
                  <option value="mañana">Mañana</option>
                  <option value="tarde">Tarde</option>
                  <option value="noche">Noche</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Área de laboratorio</label>
                <input type="text" name="area_laboratorio" value={form.area_laboratorio} onChange={handleChange}
                  placeholder="Ej: Hematología, Microbiología, etc."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </>
          )}

          {/* Campos específicos para Administrativo */}
          {form.rol === 'administrativo' && (
            <>
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Datos Administrativos</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                <input type="text" name="departamento" value={form.departamento} onChange={handleChange}
                  placeholder="Ej: Recepción, Admisiones, etc."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                <input type="text" name="cargo" value={form.cargo} onChange={handleChange}
                  placeholder="Ej: Recepcionista, Auxiliar administrativo, etc."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                <input type="text" name="area" value={form.area} onChange={handleChange}
                  placeholder="Ej: Admisiones, Recursos Humanos, etc."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </>
          )}

          {/* Campos específicos para Directivo */}
          {form.rol === 'directivo' && (
            <>
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Datos del Directivo</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                <input type="text" name="cargo" value={form.cargo} onChange={handleChange}
                  placeholder="Ej: Director General, Subdirector Médico, etc."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                <input type="text" name="departamento" value={form.departamento} onChange={handleChange}
                  placeholder="Ej: Dirección General, Dirección Médica, etc."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </>
          )}

          {form.rol === 'enfermero_estudiantil' && (
            <>
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Datos del Enfermero Estudiantil</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cédula profesional</label>
                <input type="text" name="cedula_profesional" value={form.cedula_profesional} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
                <select name="turno" value={form.turno} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Seleccionar...</option>
                  <option value="mañana">Mañana</option>
                  <option value="tarde">Tarde</option>
                  <option value="noche">Noche</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                <input type="text" name="area" value={form.area} onChange={handleChange}
                  placeholder="Ej: Consultorio universitario"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium mt-4">
            Registrar Personal
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegistroPersonal