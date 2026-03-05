import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import RutaProtegida from './components/RutaProtegida'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Pacientes from './pages/Pacientes'
import RegistroPaciente from './pages/RegistroPaciente'
import DetallePaciente from './pages/DetallePaciente'
import AgregarRegistro from './pages/AgregarRegistro'
import RegistroPersonal from './pages/RegistroPersonal'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <RutaProtegida>
              <Home />
            </RutaProtegida>
          } />
          <Route path="/pacientes" element={
            <RutaProtegida>
              <Pacientes />
            </RutaProtegida>
          } />
          <Route path="/registro-paciente" element={
            <RutaProtegida roles={['administrativo']}>
              <RegistroPaciente />
            </RutaProtegida>
          } />
          <Route path="/paciente/:id" element={
            <RutaProtegida>
              <DetallePaciente />
            </RutaProtegida>
          } />
          <Route path="/paciente/:id/agregar-registro" element={
            <RutaProtegida roles={['doctor', 'enfermera', 'laboratorio']}>
              <AgregarRegistro />
            </RutaProtegida>
          } />
          <Route path="/registro-personal" element={
            <RutaProtegida roles={['administrativo']}>
              <RegistroPersonal />
            </RutaProtegida>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App