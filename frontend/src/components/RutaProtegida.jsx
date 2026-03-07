import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const RutaProtegida = ({ children, roles }) => {
  const { personal } = useContext(AuthContext)
  const location = useLocation()

  if (!personal) {
    localStorage.setItem('redirectAfterLogin', location.pathname)
    return <Navigate to="/login" />
  }

  if (roles && !roles.includes(personal.rol)) {
    return <Navigate to="/" />
  }

  return children
}

export default RutaProtegida