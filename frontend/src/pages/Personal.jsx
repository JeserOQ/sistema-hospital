import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { personalService } from '../services/api'
import { AuthContext } from '../context/AuthContext'

const Personal = () => {
  const navigate = useNavigate()
  const { personal: usuarioActual } = useContext(AuthContext)
  const [personal, setPersonal] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroRol, setFiltroRol] = useState('')
  const [seleccionado, setSeleccionado] = useState(null)
  const [editando, setEditando] = useState(false)
  const [formEdit, setFormEdit] = useState({})
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    cargarPersonal()
  }, [])

  const cargarPersonal = async () => {
    try {
      const res = await personalService.getAll()
      setPersonal(res.data)
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const personalFiltrado = personal.filter(p => {
    const coincideBusqueda =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.email.toLowerCase().includes(busqueda.toLowerCase())
    const coincideRol = filtroRol === '' || p.rol === filtroRol
    return coincideBusqueda && coincideRol
  })

  const abrirDetalle = (p) => {
    setSeleccionado(p)
    setEditando(false)
    setMensaje('')
  }

  const cerrarDetalle = () => {
    setSeleccionado(null)
    setEditando(false)
    setMensaje('')
  }

  const iniciarEdicion = () => {
    setFormEdit({
      nombre: seleccionado.nombre,
      email: seleccionado.email,
      rol: seleccionado.rol
    })
    setEditando(true)
  }

  const guardarEdicion = async () => {
    try {
      await personalService.update(seleccionado.id, formEdit)
      setMensaje('Datos actualizados correctamente')
      setEditando(false)
      await cargarPersonal()
      setSeleccionado({ ...seleccionado, ...formEdit })
    } catch (err) {
      setMensaje('Error al actualizar los datos')
    }
  }

  const toggleActivo = async () => {
    const nuevoEstado = !seleccionado.activo
    try {
      await personalService.update(seleccionado.id, { activo: nuevoEstado })
      setMensaje(nuevoEstado ? 'Personal activado correctamente' : 'Personal desactivado correctamente')
      await cargarPersonal()
      setSeleccionado({ ...seleccionado, activo: nuevoEstado })
    } catch (err) {
      setMensaje('Error al cambiar el estado')
    }
  }

  const coloresPorRol = {
    doctor: 'bg-blue-100 text-blue-700',
    enfermera: 'bg-green-100 text-green-700',
    laboratorio: 'bg-purple-100 text-purple-700',
    administrativo: 'bg-yellow-100 text-yellow-700',
    directivo: 'bg-red-100 text-red-700'
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-xl">Cargando personal...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Encabezado */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Personal del Hospital</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/registro-personal')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium">
              + Registrar Personal
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
              ← Inicio
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-48"
          />
          <select
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Todos los roles</option>
            <option value="doctor">Doctor</option>
            <option value="enfermera">Enfermera</option>
            <option value="laboratorio">Laboratorio</option>
            <option value="administrativo">Administrativo</option>
            <option value="directivo">Directivo</option>
          </select>
          <span className="text-gray-500 text-sm self-center">
            {personalFiltrado.length} resultado(s)
          </span>
        </div>

        {/* Lista de personal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {personalFiltrado.map(p => (
            <div
              key={p.id}
              onClick={() => abrirDetalle(p)}
              className={`bg-white p-5 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow border-l-4 ${p.activo ? 'border-green-500' : 'border-gray-300 opacity-60'}`}>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-md font-semibold text-gray-800">{p.nombre}</h2>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${coloresPorRol[p.rol] || 'bg-gray-100 text-gray-700'}`}>
                  {p.rol}
                </span>
              </div>
              <p className="text-gray-500 text-sm">{p.email}</p>
              <p className={`text-xs mt-2 font-medium ${p.activo ? 'text-green-600' : 'text-red-500'}`}>
                {p.activo ? '● Activo' : '● Inactivo'}
              </p>
            </div>
          ))}
        </div>

        {personalFiltrado.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500">No se encontró personal con esos filtros</p>
          </div>
        )}
      </div>

      {/* Panel de detalle */}
      {seleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">

            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">Detalle del Personal</h2>
              <button onClick={cerrarDetalle} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>

            {mensaje && (
              <div className={`p-3 rounded-lg mb-4 text-sm ${mensaje.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {mensaje}
              </div>
            )}

            {!editando ? (
              <>
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Nombre</p>
                    <p className="text-gray-800 font-medium">{seleccionado.nombre}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Email</p>
                    <p className="text-gray-800">{seleccionado.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Rol</p>
                    <span className={`text-sm px-2 py-1 rounded-full font-medium ${coloresPorRol[seleccionado.rol] || 'bg-gray-100 text-gray-700'}`}>
                      {seleccionado.rol}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Fecha de contratación</p>
                    <p className="text-gray-800">{seleccionado.fecha_contratacion || 'No registrada'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Estado</p>
                    <p className={`font-medium ${seleccionado.activo ? 'text-green-600' : 'text-red-500'}`}>
                      {seleccionado.activo ? '● Activo' : '● Inactivo'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={iniciarEdicion}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">
                    Editar
                  </button>
                  <button
                    onClick={toggleActivo}
                    className={`flex-1 py-2 rounded-lg font-medium ${seleccionado.activo ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                    {seleccionado.activo ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text" value={formEdit.nombre}
                      onChange={(e) => setFormEdit({ ...formEdit, nombre: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email" value={formEdit.email}
                      onChange={(e) => setFormEdit({ ...formEdit, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                    <select
                      value={formEdit.rol}
                      onChange={(e) => setFormEdit({ ...formEdit, rol: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="doctor">Doctor</option>
                      <option value="enfermera">Enfermera</option>
                      <option value="laboratorio">Laboratorio</option>
                      <option value="administrativo">Administrativo</option>
                      <option value="directivo">Directivo</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={guardarEdicion}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditando(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 font-medium">
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Personal