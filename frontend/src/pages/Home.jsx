const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Sistema Hospital QR
        </h1>
        <p className="text-gray-600 mb-6">
          Gestión de pacientes mediante códigos QR
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/pacientes" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Ver Pacientes
          </a>
          <a href="/registro-paciente" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            Nuevo Paciente
          </a>
          <a href="/registro-personal" className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
            Registrar Personal
          </a>
        </div>
      </div>
    </div>
  )
}

export default Home