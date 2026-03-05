import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RutaProtegida = ({ children, roles }) => {
  const { personal } = useAuth()

  if (!personal) {
    return <Navigate to="/login" />
  }

  if (roles && !roles.includes(personal.rol)) {
    return <Navigate to="/" />
  }

  return children
}

export default RutaProtegida