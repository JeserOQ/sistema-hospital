import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { registrosService, pacientesService } from '../services/api'
import { AuthContext } from '../context/AuthContext'

const camposPorTipo = {
  diagnostico: [
    { name: 'descripcion', label: 'Descripción del diagnóstico', type: 'textarea', required: true },
    { name: 'gravedad', label: 'Gravedad', type: 'select', required: true, options: ['Leve', 'Moderado', 'Grave'] }
  ],
  medicamento: [
    { name: 'nombre_medicamento', label: 'Nombre del medicamento', type: 'text', required: true },
    { name: 'dosis', label: 'Dosis', type: 'text', required: true, placeholder: 'Ej: 500mg' },
    { name: 'via_administracion', label: 'Vía de administración', type: 'select', required: true, options: ['Oral', 'Intravenosa', 'Intramuscular', 'Sublingual', 'Tópica', 'Inhalatoria'] },
    { name: 'frecuencia', label: 'Frecuencia', type: 'select', required: true, options: ['Cada 4 horas', 'Cada 6 horas', 'Cada 8 horas', 'Cada 12 horas', 'Cada 24 horas', 'Dosis única'] },
    { name: 'descripcion', label: 'Descripción adicional', type: 'textarea', required: false }
  ],
  analisis: [
    { name: 'tipo_analisis', label: 'Tipo de análisis', type: 'select', required: true, options: ['Hemograma', 'Química sanguínea', 'Uroanálisis', 'Cultivo bacteriano', 'Perfil lipídico', 'Prueba de embarazo', 'Glucosa en ayuno', 'Función hepática', 'Función renal'] },
    { name: 'resultado', label: 'Resultado', type: 'textarea', required: true },
    { name: 'descripcion', label: 'Observaciones', type: 'textarea', required: false }
  ],
  signos_vitales: [
    { name: 'presion_arterial', label: 'Presión arterial', type: 'text', required: true, placeholder: 'Ej: 120/80 mmHg' },
    { name: 'frecuencia_cardiaca', label: 'Frecuencia cardíaca', type: 'text', required: true, placeholder: 'Ej: 75 bpm' },
    { name: 'temperatura', label: 'Temperatura', type: 'text', required: true, placeholder: 'Ej: 36.5 °C' },
    { name: 'frecuencia_respiratoria', label: 'Frecuencia respiratoria', type: 'text', required: true, placeholder: 'Ej: 16 rpm' },
    { name: 'saturacion_oxigeno', label: 'Saturación de oxígeno', type: 'text', required: true, placeholder: 'Ej: 98%' },
    { name: 'descripcion', label: 'Descripción adicional', type: 'textarea', required: false }
  ]
}

const AgregarRegistro = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { personal } = useContext(AuthContext)
  const [paciente, setPaciente] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [tipo, setTipo] = useState('')
  const [campos, setCampos] = useState({})

  useEffect(() => {
    pacientesService.getById(id)
      .then(res => setPaciente(res.data))
      .catch(err => console.error(err))
  }, [id])

  useEffect(() => {
    setCampos({})
  }, [tipo])

  const handleCampo = (e) => {
    setCampos({ ...campos, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const descripcionFinal = Object.entries(campos)
        .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`)
        .join(' | ')

      await registrosService.create({
        paciente_id: id,
        personal_id: personal.id,
        tipo,
        descripcion: descripcionFinal
      })
      setMensaje('Registro agregado exitosamente')
      setTimeout(() => navigate(`/paciente/${id}`), 1500)
    } catch (error) {
      setMensaje('Error al agregar el registro')
    }
  }

  const renderCampo = (campo) => {
    if (campo.type === 'textarea') {
      return (
        <div key={campo.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
          <textarea
            name={campo.name}
            value={campos[campo.name] || ''}
            onChange={handleCampo}
            required={campo.required}
            rows="3"
            placeholder={campo.placeholder || ''}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )
    }
    if (campo.type === 'select') {
      return (
        <div key={campo.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
          <select
            name={campo.name}
            value={campos[campo.name] || ''}
            onChange={handleCampo}
            required={campo.required}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar...</option>
            {campo.options.map(op => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>
        </div>
      )
    }
    return (
      <div key={campo.name}>
        <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
        <input
          type="text"
          name={campo.name}
          value={campos[campo.name] || ''}
          onChange={handleCampo}
          required={campo.required}
          placeholder={campo.placeholder || ''}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Agregar Registro</h1>
        {paciente && (
          <p className="text-gray-500 mb-2">
            Paciente: <span className="font-medium text-gray-700">{paciente.nombre}</span>
          </p>
        )}
        {personal && (
          <p className="text-gray-500 mb-6">
            Registrado por: <span className="font-medium text-gray-700">{personal.nombre} ({personal.rol})</span>
          </p>
        )}
        {mensaje && (
          <div className={`p-4 rounded-lg mb-4 ${mensaje.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {mensaje}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de registro</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar...</option>
              <option value="diagnostico">Diagnóstico</option>
              <option value="medicamento">Medicamento</option>
              <option value="analisis">Análisis de laboratorio</option>
              <option value="signos_vitales">Signos vitales</option>
            </select>
          </div>

          {tipo && camposPorTipo[tipo].map(campo => renderCampo(campo))}

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Guardar Registro
            </button>
            <button
              type="button"
              onClick={() => navigate(`/paciente/${id}`)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AgregarRegistro