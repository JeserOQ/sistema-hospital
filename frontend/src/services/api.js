import axios from 'axios'

const api = axios.create({
  baseURL: 'https://sistema-hospital-67yq.onrender.com/api'
})

// Agrega el token JWT en cada petición automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const pacientesService = {
  getAll: () => api.get('/pacientes'),
  getById: (id) => api.get(`/pacientes/${id}`),
  create: (data) => api.post('/pacientes', data),
  update: (id, data) => api.put(`/pacientes/${id}`, data)
}

export const personalService = {
  getAll: () => api.get('/personal'),
  getById: (id) => api.get(`/personal/${id}`),
  create: (data) => api.post('/auth/registro', data),
  update: (id, data) => api.put(`/personal/${id}`, data)
}

export const registrosService = {
  getByPaciente: (pacienteId) => api.get(`/registros/paciente/${pacienteId}`),
  getByTipo: (pacienteId, tipo) => api.get(`/registros/paciente/${pacienteId}/tipo/${tipo}`),
  create: (data) => api.post('/registros', data)
}

export const estudiantesService = {
  getAll: () => api.get('/estudiantes'),
  getById: (id) => api.get(`/estudiantes/${id}`),
  create: (data) => api.post('/estudiantes', data)
}

export const citasService = {
  getByEstudiante: (id) => api.get(`/citas/estudiante/${id}`),
  create: (data) => api.post('/citas', data)
}