import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { pacientesService } from '../services/api'
import { AuthContext } from '../context/AuthContext'

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([])
  const [loading, setLoading] = useState(true)
  const { personal } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    pacientesService.getAll()
      .then(res => {
        setPacientes(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-xl">Cargando pacientes...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Lista de Pacientes</h1>
          {personal?.rol === 'administrativo' ? (
            <button
              onClick={() => navigate('/registro-paciente')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              + Nuevo Paciente
            </button>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
              ← Inicio
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pacientes.map(paciente => (
            <div key={paciente.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{paciente.nombre}</h2>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Tipo de sangre:</span> {paciente.tipo_sangre}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Cama:</span> {paciente.cama}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                <span className="font-medium">Diagnóstico:</span> {paciente.diagnostico}
              </p>
              <button
                onClick={() => navigate(`/paciente/${paciente.id}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                Ver detalles y QR
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Pacientes