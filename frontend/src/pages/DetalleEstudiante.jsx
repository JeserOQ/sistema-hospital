import { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { estudiantesService, citasService } from '../services/api'
import { AuthContext } from '../context/AuthContext'

const DetalleEstudiante = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { personal } = useContext(AuthContext)
  const [estudiante, setEstudiante] = useState(null)
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      estudiantesService.getById(id),
      citasService.getByEstudiante(id)
    ]).then(([estRes, citasRes]) => {
      setEstudiante(estRes.data)
      setCitas(citasRes.data)
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setLoading(false)
    })
  }, [id])

  const imprimirReceta = (cita) => {
    const fecha = new Date(cita.created_at).toLocaleString('es-MX', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })

    const ventana = window.open('', '_blank')
    ventana.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8"/>
        <title>Receta Médica - ${estudiante.nombre}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 13px; color: #222; padding: 30px; }

          .encabezado { 
            border-bottom: 3px solid #1F3864; 
            padding-bottom: 16px; 
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .encabezado-izq h1 { font-size: 18px; color: #1F3864; font-weight: bold; }
          .encabezado-izq p { font-size: 12px; color: #555; margin-top: 4px; }
          .encabezado-der { text-align: right; font-size: 12px; color: #555; }
          .encabezado-der strong { color: #1F3864; font-size: 13px; }

          .seccion { margin-bottom: 18px; }
          .seccion h2 {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            color: #1F3864;
            border-bottom: 1px solid #ddd;
            padding-bottom: 4px;
            margin-bottom: 10px;
            letter-spacing: 0.5px;
          }

          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
          .campo { margin-bottom: 6px; }
          .campo label { font-size: 11px; color: #888; display: block; }
          .campo span { font-size: 13px; color: #222; }

          .receta-box {
            background: #f0f4ff;
            border-left: 4px solid #1F3864;
            padding: 12px 16px;
            border-radius: 4px;
            font-size: 13px;
            line-height: 1.6;
            white-space: pre-wrap;
          }

          .signos {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            background: #f9f9f9;
            padding: 12px;
            border-radius: 4px;
          }
          .signo-item label { font-size: 11px; color: #888; display: block; }
          .signo-item span { font-size: 13px; font-weight: bold; color: #1F3864; }

          .pie {
            border-top: 2px solid #1F3864;
            margin-top: 40px;
            padding-top: 16px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .firma { text-align: center; }
          .firma .linea { border-top: 1px solid #222; width: 200px; margin: 40px auto 4px; }
          .firma p { font-size: 12px; color: #555; }
          .firma strong { font-size: 13px; color: #222; }

          .fecha-impresion { font-size: 11px; color: #999; }

          @media print {
            body { padding: 20px; }
            button { display: none !important; }
          }
        </style>
      </head>
      <body>

        <!-- ENCABEZADO -->
        <div class="encabezado">
          <div class="encabezado-izq">
            <h1>Instituto Tecnológico de Villahermosa</h1>
            <p>Campus Villahermosa — Servicio Médico Estudiantil</p>
            <p>Villahermosa, Tabasco, México</p>
          </div>
          <div class="encabezado-der">
            <strong>RECETA MÉDICA</strong><br/>
            <span>Fecha: ${fecha}</span>
          </div>
        </div>

        <!-- DATOS DEL ESTUDIANTE -->
        <div class="seccion">
          <h2>Datos del Estudiante</h2>
          <div class="grid-2">
            <div class="campo">
              <label>Nombre completo</label>
              <span>${estudiante.nombre}</span>
            </div>
            <div class="campo">
              <label>Matrícula</label>
              <span>${estudiante.matricula}</span>
            </div>
            <div class="campo">
              <label>Carrera</label>
              <span>${estudiante.carrera || 'No registrada'}</span>
            </div>
            <div class="campo">
              <label>Semestre</label>
              <span>${estudiante.semestre || 'No registrado'}</span>
            </div>
            <div class="campo">
              <label>Tipo de sangre</label>
              <span>${estudiante.tipo_sangre || 'No registrado'}</span>
            </div>
            <div class="campo">
              <label>Alergias</label>
              <span>${estudiante.alergias || 'Ninguna'}</span>
            </div>
          </div>
        </div>

        <!-- MOTIVO Y DIAGNÓSTICO -->
        <div class="seccion">
          <h2>Consulta Médica</h2>
          <div class="campo" style="margin-bottom:10px;">
            <label>Motivo de consulta</label>
            <span>${cita.motivo_consulta || '—'}</span>
          </div>
          <div class="campo">
            <label>Diagnóstico</label>
            <span>${cita.diagnostico || '—'}</span>
          </div>
        </div>

        ${cita.receta ? `
        <!-- RECETA -->
        <div class="seccion">
          <h2>Receta / Medicamentos</h2>
          <div class="receta-box">${cita.receta}</div>
        </div>
        ` : ''}

        ${(cita.presion_arterial || cita.frecuencia_cardiaca || cita.temperatura || cita.saturacion_oxigeno) ? `
        <!-- SIGNOS VITALES -->
        <div class="seccion">
          <h2>Signos Vitales</h2>
          <div class="signos">
            ${cita.presion_arterial ? `<div class="signo-item"><label>Presión arterial</label><span>${cita.presion_arterial} mmHg</span></div>` : ''}
            ${cita.frecuencia_cardiaca ? `<div class="signo-item"><label>Frecuencia cardíaca</label><span>${cita.frecuencia_cardiaca} bpm</span></div>` : ''}
            ${cita.temperatura ? `<div class="signo-item"><label>Temperatura</label><span>${cita.temperatura} °C</span></div>` : ''}
            ${cita.saturacion_oxigeno ? `<div class="signo-item"><label>Saturación de oxígeno</label><span>${cita.saturacion_oxigeno} %</span></div>` : ''}
          </div>
        </div>
        ` : ''}

        ${cita.observaciones ? `
        <!-- OBSERVACIONES -->
        <div class="seccion">
          <h2>Observaciones</h2>
          <p style="line-height:1.6;">${cita.observaciones}</p>
        </div>
        ` : ''}

        <!-- PIE DE PÁGINA -->
        <div class="pie">
          <div class="fecha-impresion">
            Documento generado el ${new Date().toLocaleString('es-MX')}
          </div>
          <div class="firma">
            <div class="linea"></div>
            <strong>${cita.personal?.nombre || personal.nombre}</strong>
            <p>Enfermero Estudiantil</p>
            <p>Servicio Médico — ITVH</p>
          </div>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `)
    ventana.document.close()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-xl">Cargando...</p>
    </div>
  )

  if (!estudiante) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500 text-xl">Estudiante no encontrado</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">

        {/* Datos del estudiante */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{estudiante.nombre}</h1>
            <button onClick={() => navigate('/estudiantes')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm">
              ← Atrás
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-gray-600"><span className="font-medium">Matrícula:</span> {estudiante.matricula}</p>
              <p className="text-gray-600"><span className="font-medium">Carrera:</span> {estudiante.carrera || 'No registrada'}</p>
              <p className="text-gray-600"><span className="font-medium">Semestre:</span> {estudiante.semestre || 'No registrado'}</p>
              <p className="text-gray-600"><span className="font-medium">Fecha de nacimiento:</span> {estudiante.fecha_nacimiento || 'No registrada'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600"><span className="font-medium">Tipo de sangre:</span>
                <span className="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded font-bold">{estudiante.tipo_sangre || 'No registrado'}</span>
              </p>
              <p className="text-gray-600"><span className="font-medium">Alergias:</span> {estudiante.alergias || 'Ninguna'}</p>
              <p className="text-gray-600"><span className="font-medium">Contacto:</span> {estudiante.contacto_emergencia || 'No registrado'}</p>
              <p className="text-gray-600"><span className="font-medium">Teléfono:</span> {estudiante.telefono_emergencia || 'No registrado'}</p>
            </div>
          </div>
        </div>

        {/* Historial de consultas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Historial de Consultas</h2>
            <button
              onClick={() => navigate(`/estudiante/${id}/agregar-cita`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
              + Nueva Consulta Médica
            </button>
          </div>

          {citas.length === 0 ? (
            <p className="text-gray-500">No hay consultas registradas</p>
          ) : (
            <div className="space-y-4">
              {citas.map(cita => (
                <div key={cita.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-gray-400 text-sm">
                      {new Date(cita.created_at).toLocaleString()}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-sm">
                        Atendido por: {cita.personal?.nombre}
                      </span>
                      <button
                        onClick={() => imprimirReceta(cita)}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700 flex items-center gap-1">
                        🖨️ Imprimir receta
                      </button>
                    </div>
                  </div>
                  {cita.motivo_consulta && (
                    <p className="text-gray-700 text-sm mb-1"><span className="font-medium">Motivo:</span> {cita.motivo_consulta}</p>
                  )}
                  {cita.diagnostico && (
                    <p className="text-gray-700 text-sm mb-1"><span className="font-medium">Diagnóstico:</span> {cita.diagnostico}</p>
                  )}
                  {cita.receta && (
                    <p className="text-gray-700 text-sm mb-1"><span className="font-medium">Receta:</span> {cita.receta}</p>
                  )}
                  {(cita.presion_arterial || cita.frecuencia_cardiaca || cita.temperatura || cita.saturacion_oxigeno) && (
                    <div className="mt-2 bg-blue-50 p-2 rounded text-sm">
                      <p className="font-medium text-blue-700 mb-1">Signos vitales:</p>
                      <div className="grid grid-cols-2 gap-1 text-gray-600">
                        {cita.presion_arterial && <p>Presión: {cita.presion_arterial}</p>}
                        {cita.frecuencia_cardiaca && <p>Frecuencia: {cita.frecuencia_cardiaca} bpm</p>}
                        {cita.temperatura && <p>Temperatura: {cita.temperatura}°C</p>}
                        {cita.saturacion_oxigeno && <p>Saturación: {cita.saturacion_oxigeno}%</p>}
                      </div>
                    </div>
                  )}
                  {cita.observaciones && (
                    <p className="text-gray-600 text-sm mt-2"><span className="font-medium">Observaciones:</span> {cita.observaciones}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default DetalleEstudiante