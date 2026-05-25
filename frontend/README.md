Sistema de Gestión Hospitalaria con Pulseras QR (SGHQR)
    Sistema web  para la gestión de pacientes hospitalarios mediante códigos QR.

🌐 URLs en Producción
🖥️ Frontend
https://sistema-hospital-flame.vercel.app
⚙️ Backend
https://sistema-hospital-67yq.onrender.com
🗄️ Base de datos
https://supabase.com/dashboard/project/bnhjgivmggmatwwaecbk


ESTRUCTURA DEL PROYECTO:

sistema-hospital/
│
├── 📂 frontend/                        # Aplicación React.js
│   ├── 📂 public/
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── Navbar.jsx              # Barra de navegación con nombre, rol y cierre de sesión
│   │   │   └── RutaProtegida.jsx       # Guardia de rutas por sesión y rol
│   │   │
│   │   ├── 📂 context/
│   │   │   └── AuthContext.jsx         # Contexto global de sesión (token, usuario, login, logout)
│   │   │
│   │   ├── 📂 pages/
│   │   │   ├── Login.jsx               # Pantalla de inicio de sesión
│   │   │   ├── Home.jsx                # Pantalla de inicio por rol
│   │   │   ├── Pacientes.jsx           # Lista de pacientes con buscador
│   │   │   ├── DetallePaciente.jsx     # Expediente clínico + QR + historial
│   │   │   ├── RegistroPaciente.jsx    # Formulario de registro de paciente
│   │   │   ├── AgregarRegistro.jsx     # Formulario de historial clínico
│   │   │   ├── Personal.jsx            # Lista de personal (directivo)
│   │   │   ├── RegistroPersonal.jsx    # Formulario de registro de personal
│   │   │   ├── Estudiantes.jsx         # Lista de estudiantes universitarios
│   │   │   ├── DetalleEstudiante.jsx   # Expediente + historial de consultas
│   │   │   ├── RegistroEstudiante.jsx  # Formulario de registro de estudiante
│   │   │   ├── AgregarCita.jsx         # Formulario de consulta médica
│   │   │   ├── OlvidePassword.jsx      # Solicitar recuperación de contraseña
│   │   │   └── ResetPassword.jsx       # Restablecer contraseña con token
│   │   │
│   │   ├── 📂 services/
│   │   │   └── api.js                  # Centraliza peticiones HTTP con Axios + interceptor JWT
│   │   │
│   │   ├── App.jsx                     # Componente raíz con todas las rutas
│   │   └── main.jsx                    # Punto de entrada de React
│   │
│   ├── vercel.json                     # Configuración de rewrites para React Router en Vercel
│   ├── package.json
│   └── vite.config.js
│
├── 📂 backend/                         # API REST Node.js + Express
│   ├── 📂 src/
│   │   ├── 📂 controllers/
│   │   │   ├── authController.js       # Login y registro de personal
│   │   │   ├── pacientesController.js  # CRUD de pacientes
│   │   │   ├── personalController.js   # CRUD de personal
│   │   │   ├── registrosController.js  # Historial clínico
│   │   │   ├── estudiantesController.js# CRUD de estudiantes universitarios
│   │   │   ├── citasController.js      # Consultas médicas universitarias
│   │   │   └── resetController.js      # Recuperación de contraseña con Resend
│   │   │
│   │   ├── 📂 routes/
│   │   │   ├── auth.js                 # POST /login, POST /registro
│   │   │   ├── pacientes.js            # GET /, GET /:id, POST /, PUT /:id
│   │   │   ├── personal.js             # GET /, GET /:id, GET /:id/completo, POST /, PUT /:id
│   │   │   ├── registros.js            # GET /paciente/:id, POST /
│   │   │   ├── estudiantes.js          # GET /, GET /:id, POST /
│   │   │   ├── citas.js                # GET /estudiante/:id, POST /
│   │   │   └── reset.js                # POST /solicitar, POST /confirmar
│   │   │
│   │   ├── 📂 middleware/
│   │   │   └── auth.js                 # verificarToken() y verificarRol() con JWT
│   │   │
│   │   └── supabase.js                 # Inicialización del cliente de Supabase
│   │
│   ├── index.js                        # Punto de entrada del servidor Express
│   ├── .env                            # Variables de entorno (NO subir a GitHub)
│   └── package.json
│
└── README.md

