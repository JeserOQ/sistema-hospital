import { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { estudiantesService, citasService } from '../services/api'
import { AuthContext } from '../context/AuthContext'

const DetalleEstudiante = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { personal } = useContext(AuthContext)
  const [estudiante, setEstudiante] = useState(null)
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      estudiantesService.getById(id),
      citasService.getByEstudiante(id)
    ]).then(([estRes, citasRes]) => {
      setEstudiante(estRes.data)
      setCitas(citasRes.data)
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setLoading(false)
    })
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-xl">Cargando...</p>
    </div>
  )

  if (!estudiante) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500 text-xl">Estudiante no encontrado</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">

        {/* Datos del estudiante */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{estudiante.nombre}</h1>
            <button onClick={() => navigate('/estudiantes')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm">
              ← Atrás
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-gray-600"><span className="font-medium">Matrícula:</span> {estudiante.matricula}</p>
              <p className="text-gray-600"><span className="font-medium">Carrera:</span> {estudiante.carrera || 'No registrada'}</p>
              <p className="text-gray-600"><span className="font-medium">Semestre:</span> {estudiante.semestre || 'No registrado'}</p>
              <p className="text-gray-600"><span className="font-medium">Fecha de nacimiento:</span> {estudiante.fecha_nacimiento || 'No registrada'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600"><span className="font-medium">Tipo de sangre:</span>
                <span className="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded font-bold">{estudiante.tipo_sangre || 'No registrado'}</span>
              </p>
              <p className="text-gray-600"><span className="font-medium">Alergias:</span> {estudiante.alergias || 'Ninguna'}</p>
              <p className="text-gray-600"><span className="font-medium">Contacto:</span> {estudiante.contacto_emergencia || 'No registrado'}</p>
              <p className="text-gray-600"><span className="font-medium">Teléfono:</span> {estudiante.telefono_emergencia || 'No registrado'}</p>
            </div>
          </div>
        </div>

        {/* Historial de citas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Historial de Citas</h2>
            <button
              onClick={() => navigate(`/estudiante/${id}/agregar-cita`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
              + Nueva Consulta Medica
            </button>
          </div>

          {citas.length === 0 ? (
            <p className="text-gray-500">No hay citas registradas</p>
          ) : (
            <div className="space-y-4">
              {citas.map(cita => (
                <div key={cita.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-gray-400 text-sm">
                      {new Date(cita.created_at).toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-sm">
                      Atendido por: {cita.personal?.nombre}
                    </span>
                  </div>
                  {cita.motivo_consulta && (
                    <p className="text-gray-700 text-sm mb-1"><span className="font-medium">Motivo:</span> {cita.motivo_consulta}</p>
                  )}
                  {cita.diagnostico && (
                    <p className="text-gray-700 text-sm mb-1"><span className="font-medium">Diagnóstico:</span> {cita.diagnostico}</p>
                  )}
                  {cita.receta && (
                    <p className="text-gray-700 text-sm mb-1"><span className="font-medium">Receta:</span> {cita.receta}</p>
                  )}
                  {(cita.presion_arterial || cita.frecuencia_cardiaca || cita.temperatura || cita.saturacion_oxigeno) && (
                    <div className="mt-2 bg-blue-50 p-2 rounded text-sm">
                      <p className="font-medium text-blue-700 mb-1">Signos vitales:</p>
                      <div className="grid grid-cols-2 gap-1 text-gray-600">
                        {cita.presion_arterial && <p>Presión: {cita.presion_arterial}</p>}
                        {cita.frecuencia_cardiaca && <p>Frecuencia: {cita.frecuencia_cardiaca} bpm</p>}
                        {cita.temperatura && <p>Temperatura: {cita.temperatura}°C</p>}
                        {cita.saturacion_oxigeno && <p>Saturación: {cita.saturacion_oxigeno}%</p>}
                      </div>
                    </div>
                  )}
                  {cita.observaciones && (
                    <p className="text-gray-600 text-sm mt-2"><span className="font-medium">Observaciones:</span> {cita.observaciones}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default DetalleEstudiante