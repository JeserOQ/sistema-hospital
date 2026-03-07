import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const Home = () => {
  const { personal } = useContext(AuthContext)
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

        <div className="flex flex-col gap-3">
          {/* Todos los roles */}
          <a href="/pacientes"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
            Ver Pacientes
          </a>

          {/* Solo administrativo */}
          {rol === 'administrativo' && (
            <>
              <a href="/registro-paciente"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium">
                Registrar Nuevo Paciente
              </a>
              <a href="/registro-personal"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium">
                Registrar Personal
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home