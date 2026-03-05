import { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [personal, setPersonal] = useState(
    JSON.parse(localStorage.getItem('personal')) || null
  )

  const login = (token, personalData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('personal', JSON.stringify(personalData))
    setPersonal(personalData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('personal')
    setPersonal(null)
  }

  return (
    <AuthContext.Provider value={{ personal, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)