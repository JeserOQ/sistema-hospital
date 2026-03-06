import axios from 'axios'

const api = axios.create({
  baseURL: 'https://sistema-hospital-67yq.onrender.com'
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
  create: (data) => api.post('/personal', data)
}

export const registrosService = {
  getByPaciente: (pacienteId) => api.get(`/registros/paciente/${pacienteId}`),
  getByTipo: (pacienteId, tipo) => api.get(`/registros/paciente/${pacienteId}/tipo/${tipo}`),
  create: (data) => api.post('/registros', data)
}