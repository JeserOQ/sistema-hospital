import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const OlvidePassword = () => {
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    try {
      await axios.post('https://sistema-hospital-67yq.onrender.com/api/reset/solicitar', { email })
      setMensaje('Correo enviado correctamente. Revisa tu bandeja de entrada.')
      setError('')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar el correo')
      setMensaje('')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Recuperar contraseña
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña
        </p>
        {mensaje && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{mensaje}</div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit" disabled={cargando}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
          >
            {cargando ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>
        <button
          onClick={() => navigate('/login')}
          className="w-full mt-3 text-blue-600 hover:underline text-sm"
        >
          Volver al login
        </button>
      </div>
    </div>
  )
}

export default OlvidePassword