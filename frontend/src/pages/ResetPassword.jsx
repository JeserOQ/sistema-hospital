import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirmar: '' })
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [verPassword, setVerPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }
    try {
      await axios.post('https://sistema-hospital-67yq.onrender.com/api/reset/confirmar', {
        token, password: form.password
      })
      setMensaje('Contraseña actualizada correctamente')
      setError('')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar la contraseña')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Nueva contraseña
        </h1>
        <p className="text-gray-500 text-center mb-6">Escribe tu nueva contraseña</p>
        {mensaje && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{mensaje}</div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
            <div className="relative">
              <input
                type={verPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <button type="button" onClick={() => setVerPassword(!verPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-sm">
                {verPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
            <input
              type={verPassword ? 'text' : 'password'}
              value={form.confirmar}
              onChange={(e) => setForm({ ...form, confirmar: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Actualizar contraseña
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword