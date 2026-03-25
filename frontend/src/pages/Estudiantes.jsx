import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { estudiantesService } from '../services/api'

const Estudiantes = () => {
  const navigate = useNavigate()
  const [estudiantes, setEstudiantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    estudiantesService.getAll()
      .then(res => {
        setEstudiantes(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const estudiantesFiltrados = estudiantes.filter(e =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.matricula.toLowerCase().includes(busqueda.toLowerCase()) ||
    (e.carrera && e.carrera.toLowerCase().includes(busqueda.toLowerCase()))
  )

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-xl">Cargando estudiantes...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Estudiantes</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/registro-estudiante')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium">
              + Nuevo Estudiante
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
              ← Inicio
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre, matrícula o carrera..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-gray-400 text-sm mt-2">{estudiantesFiltrados.length} resultado(s)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {estudiantesFiltrados.map(e => (
            <div key={e.id} className="bg-white p-5 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/estudiante/${e.id}`)}>
              <h2 className="text-md font-semibold text-gray-800 mb-1">{e.nombre}</h2>
              <p className="text-gray-500 text-sm mb-1">
                <span className="font-medium">Matrícula:</span> {e.matricula}
              </p>
              <p className="text-gray-500 text-sm mb-1">
                <span className="font-medium">Carrera:</span> {e.carrera || 'No registrada'}
              </p>
              <p className="text-gray-500 text-sm">
                <span className="font-medium">Semestre:</span> {e.semestre || 'No registrado'}
              </p>
            </div>
          ))}
        </div>

        {estudiantesFiltrados.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500">No se encontraron estudiantes</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default Estudiantes