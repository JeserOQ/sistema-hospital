import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import QRCode from 'react-qr-code'
import { pacientesService, registrosService } from '../services/api'

const DetallePaciente = () => {
  const { id } = useParams()
  const [paciente, setPaciente] = useState(null)
  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      pacientesService.getById(id),
      registrosService.getByPaciente(id)
    ]).then(([pacienteRes, registrosRes]) => {
      setPaciente(pacienteRes.data)
      setRegistros(registrosRes.data)
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

  if (!paciente) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500 text-xl">Paciente no encontrado</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Datos del paciente */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{paciente.nombre}</h1>
            <div className="space-y-2">
              <p className="text-gray-600"><span className="font-medium">Fecha de nacimiento:</span> {paciente.fecha_nacimiento}</p>
              <p className="text-gray-600"><span className="font-medium">Tipo de sangre:</span>
                <span className="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded font-bold">{paciente.tipo_sangre}</span>
              </p>
              <p className="text-gray-600"><span className="font-medium">Alergias:</span> {paciente.alergias || 'Ninguna'}</p>
              <p className="text-gray-600"><span className="font-medium">Diagnóstico:</span> {paciente.diagnostico}</p>
              <p className="text-gray-600"><span className="font-medium">Cama:</span> {paciente.cama}</p>
              <p className="text-gray-600"><span className="font-medium">Fecha de ingreso:</span> {paciente.fecha_ingreso}</p>
              <p className="text-gray-600"><span className="font-medium">Contacto:</span> {paciente.contacto_emergencia}</p>
              <p className="text-gray-600"><span className="font-medium">Teléfono:</span> {paciente.telefono_emergencia}</p>
            </div>
          </div>

          {/* Código QR */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Código QR de la Pulsera</h2>
            <QRCode value={`${window.location.origin}/paciente/${paciente.id}`} size={200} />
            <p className="text-gray-500 text-sm mt-4 text-center">
              Escanea este QR para ver el expediente del paciente
            </p>
          </div>

        </div>

        {/* Historial de registros */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Historial Clínico</h2>
            
            <a href={`/paciente/${paciente.id}/agregar-registro`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
            >
            + Agregar Registro
            </a>
            </div>
          {registros.length === 0 ? (
            <p className="text-gray-500">No hay registros aún</p>
          ) : (
            <div className="space-y-3">
              {registros.map(registro => (
                <div key={registro.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                      {registro.tipo}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {new Date(registro.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">{registro.descripcion}</p>
                  <p className="text-gray-500 text-sm">
                    Por: {registro.personal?.nombre} - {registro.personal?.rol}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default DetallePaciente