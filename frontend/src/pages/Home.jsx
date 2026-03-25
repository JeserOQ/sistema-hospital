import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const { personal } = useContext(AuthContext)
  const navigate = useNavigate()
  const rol = personal?.rol

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-lg w-full">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          Sistema Hospital QR
        </h1>
        <p className="text-gray-500 mb-2">
          Bienvenido, <span className="font-medium text-gray-700">{personal?.nombre}</span>
        </p>
        <p className="text-gray-400 text-sm mb-8 capitalize">Rol: {rol}</p>

        {/* Doctor, Enfermera, Laboratorio - solo Ver Pacientes */}
        {(rol === 'doctor' || rol === 'enfermera' || rol === 'laboratorio') && (
          <button
            onClick={() => navigate('/pacientes')}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
            Ver Pacientes
          </button>
        )}

        {/* Administrativo - 2 botones:Ver Pacientes y agregar Paciente */}
        {rol === 'administrativo' && (
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/pacientes')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">
              Ver Pacientes
            </button>
            <button
              onClick={() => navigate('/registro-paciente')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium">
              Nuevo Paciente
            </button>
          </div>
        )}

        {/* Directivo - Ver Pacientes y Registrar Personal */}
        {rol === 'directivo' && (
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => navigate('/pacientes')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">
              Ver Pacientes
            </button>
            <button onClick={() => navigate('/personal')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium">
              Ver Personal
            </button>
            <button onClick={() => navigate('/registro-personal')}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium">
              Registrar Personal
            </button>
          </div>
        )}
        
        {rol === 'enfermero_estudiantil' && (
          <button onClick={() => navigate('/estudiantes')}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
            Ver Estudiantes
          </button>
        )}
        
      </div>
    </div>
  )
}

export default Home