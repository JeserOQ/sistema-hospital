import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { personal, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!personal) return null

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="font-bold text-lg">Sistema Hospital QR</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm">
          {personal.nombre}
          <span className="ml-2 bg-blue-500 px-2 py-1 rounded text-xs capitalize">
            {personal.rol}
          </span>
        </span>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded-lg text-sm hover:bg-gray-100"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}

export default Navbar