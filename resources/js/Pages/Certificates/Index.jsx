// "use client"

import { useState } from "react"
import { Head, Link } from "@inertiajs/react"
import { Html5QrcodeScanner } from "html5-qrcode"
import axios from "axios"

export default function Index({ auth }) {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [scannerStarted, setScannerStarted] = useState(false)
  const [error, setError] = useState("")

  const validateCertificate = async () => {
    if (!code) {
      setError("Por favor ingrese un código")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await axios.post("/validate-certificate", { code })
      setResult(response.data)
    } catch (error) {
      setError("Error al validar el certificado")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const startScanner = () => {
    if (scannerStarted) return

    const html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 }, false)

    html5QrcodeScanner.render(
      (decodedText) => {
        setCode(decodedText)
        html5QrcodeScanner.clear()
        setScannerStarted(false)
        validateCertificate()
      },
      (error) => {
        console.warn(error)
      },
    )

    setScannerStarted(true)
  }

  return (
    <div className="bg-orange-50 min-h-screen">
      <Head title="Validar certificados" />

      {/* Header */}
      <header className="bg-white border-b border-orange-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
  <a href="https://ispi.edu.pa/default.aspx" target="_blank" rel="noopener noreferrer">
    <img 
      src="/imagenes/logo.png" 
      alt="ISPI Logo" 
      className="h-16 w-auto" 
    />
  </a>
</div>
            <nav className="hidden md:flex items-center space-x-8">
              {/* <Link href="#" className="text-gray-700 hover:text-orange-600">
                Page
              </Link>
              <Link href="#" className="text-gray-700 hover:text-orange-600">
                Page
              </Link>
              <Link href="#" className="text-gray-700 hover:text-orange-600">
                Page
              </Link> */}
              {auth.user ? (
                <Link
                  href={window.route("dashboard")}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  Panel de Administración
                </Link>
              ) : (
                <Link
                  href={window.route("login")}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  Iniciar Sesión
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-orange-100 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-800">
            INSTITUTO SUPERIOR POLITÉCNICO INTERNACIONAL
          </h1>
          <a
            href="https://ispi.edu.pa/default.aspx"
            className="inline-block px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors shadow-md"
            target="_blank" 
  rel="noopener noreferrer" 
          >
            Ir a la página web
          </a>
        </div>
      </section>

      {/* Hero Image */}
      <div className="relative h-[400px] mb-20 shadow-md">
        <img src="/imagenes/1920x400.png" alt="Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/30 to-transparent"></div>
      </div>

      {/* Academic Offer */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Oferta académica</h2>
          <div className="w-20 h-1 bg-orange-500 mb-12 rounded-full"></div>
          <div className="grid md:grid-cols-2 gap-8">
          <a 
  href="https://ispi.edu.pa/oferta-academica/diplomados/area-tecnologia.aspx" 
  target="_blank" 
  rel="noopener noreferrer" 
  className="block group cursor-pointer transform transition-transform hover:scale-105"
>
  <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden rounded-lg shadow-md">
    <img
      src="/imagenes/diplomados.png"
      alt="Diplomados"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-orange-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
  </div>
  <h3 className="text-xl font-semibold mb-2 text-orange-700 group-hover:text-gray-800">Diplomados</h3>
  {/* <p className="text-gray-600">Body text for whatever you'd like to add more to the subheading.</p> */}
</a>
<a href="https://ispi.edu.pa/oferta-academica/tecnicos-superiores.aspx" target="_blank" 
  rel="noopener noreferrer" 
  className="block group cursor-pointer transform transition-transform hover:scale-105">
            <div className="group cursor-pointer transform transition-transform hover:scale-105">
              <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden rounded-lg shadow-md">
                <img
                  src="/imagenes/carreras.png"
                  alt="Técnico Superior"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-orange-700 group-hover:text-gray-800">
                Técnico Superior
              </h3>
              {/* <p className="text-gray-600">Body text for whatever you'd like to expand on the main point.</p> */}
            </div>
            </a>
          </div>
        </div>
      </section>

      {/* Certificate Validation */}
      <section className="py-16 bg-gradient-to-b from-orange-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Validar certificados</h2>
          <div className="w-20 h-1 bg-orange-500 mb-6 rounded-full"></div>
          <p className="text-gray-700 mb-8">
            Ingresa el código de tu certificado
            <br />
            Puedes ingresar el código manualmente o escanear el código QR de tu certificado.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Validador */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
              <div className="mb-6">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Código del certificado
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    id="code"
                    className="flex-1 rounded-md border-orange-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Ingresa el código de tu certificado"
                  />
                  <button
                    onClick={validateCertificate}
                    disabled={loading}
                    className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-sm transition-colors"
                  >
                    {loading ? "Validando..." : "Validar"}
                  </button>
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>
{/* 
              <button
                onClick={startScanner}
                className="w-full flex items-center justify-center px-4 py-2 border border-orange-300 shadow-sm text-sm font-medium rounded-md text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                Escanear QR
              </button> */}

              <div id="qr-reader" className="mt-4"></div>

              {/* Resultado de validación */}
              {result && (
                <div className="mt-6">
                  <div
                    className={`p-4 rounded-md ${
                      result.valid ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${result.valid ? "text-green-800" : "text-red-800"}`}>
                          {result.valid ? "Certificado válido" : "Certificado inválido"}
                        </h3>
                        {result.valid && result.certificate && (
                          <div className="mt-2 text-sm text-green-700">
                            <p>Estudiante: {result.certificate.student_name}</p>
                            <p>Curso: {result.certificate.course_name}</p>
                            <p>Fecha de emisión: {new Date(result.certificate.issue_date).toLocaleDateString()}</p>
                          </div>
                        )}
                        {!result.valid && (
                          <div className="mt-2 text-sm text-red-700">
                            <p>{result.message}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Imagen del certificado */}
            {result && result.valid && result.certificate && result.certificate.certificate_image ? (
              <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
                <h3 className="text-lg font-medium text-orange-800 mb-4">Certificado:</h3>
                <div className="relative">
                  <img
                    src={`/storage/${result.certificate.certificate_image}`}
                    alt="Certificado"
                    className="w-full h-auto rounded-md shadow-sm"
                  />
                  <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-3 rounded-md shadow-md border border-orange-200">
                    <div className="text-sm font-medium">
                      <p className="text-orange-800">{result.certificate.student_name}</p>
                      <p className="text-orange-600">{result.certificate.course_name}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(result.certificate.issue_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <a
                    href={`/storage/${result.certificate.certificate_image}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 transition-colors"
                  >
                    Ver certificado completo
                  </a>
                </div>
              </div>
            ) : (
              result &&
              result.valid && (
                <div className="flex items-center justify-center h-full bg-white rounded-lg p-8 shadow-md border border-orange-200">
                  <div className="text-center">
                    <p className="text-orange-600 mb-2">Este certificado no tiene una imagen asociada.</p>
                    <p className="text-gray-500 text-sm">
                      La información del certificado es válida, pero no hay una imagen para mostrar.
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#312d2d] text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">ISPI</h3>
              <p className="text-white text-sm">Instituto Superior Politécnico Internacional</p>
            </div>
            {[1].map((column) => (
              <div key={column}>
                <h4 className="text-sm font-semibold text-white mb-4">Técnicos Superiores</h4>
                <ul className="space-y-3">
                  {[1].map((item) => (
                    <li key={item}>
                      <a href="https://ispi.edu.pa/tecnicos-superiores/tecnico-superior-en-contabilidad-y-auditoria.aspx" className="text-sm text-white hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                        Contabilidad y Auditoria
                      </a>
                    </li>
                  ))}
                  {[1].map((item) => (
                    <li key={item}>
                      <a href="https://ispi.edu.pa/tecnicos-superiores/tecnico-superior-en-programacion-de-computadoras.aspx" className="text-sm text-white hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                        Programación de Computadoras
                      </a>
                    </li>
                  ))}
                  {[1].map((item) => (
                    <li key={item}>
                      <a href="https://ispi.edu.pa/tecnicos-superiores/tecnico-superior-en-relaciones-laborales.aspx" className="text-sm text-white hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                        Relaciones Laborales
                      </a>
                    </li>
                  ))}
                  {[1].map((item) => (
                    <li key={item}>
                      <a href="https://ispi.edu.pa/tecnicos-superiores/tecnico-superior-en-soporte-tecnico-en-tecnologias-de-la-informacion.aspx" className="text-sm text-white hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                        Soporte Técnico en TI
                      </a>
                    </li>
                  ))}
                  {[1].map((item) => (
                    <li key={item}>
                      <a href="https://ispi.edu.pa/tecnicos-superiores/tecnico-superior-en-telecomunicaciones.aspx" className="text-sm text-white hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                        Telecomunicaciones
                      </a>
                    </li>
                  ))}
                  {[1].map((item) => (
                    <li key={item}>
                      <a href="https://ispi.edu.pa/oferta-academica/tecnicos-superiores/tecnico-superior-en-gestion-de-operaciones.aspx" className="text-sm text-white hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                        Gestión de Operaciones
                      </a>
                    </li>
                  ))}
                  {[1].map((item) => (
                    <li key={item}>
                      <a href="https://ispi.edu.pa/oferta-academica/tecnicos-superiores/tecnico-superior-en-logistica-y-abastecimiento.aspx" className="text-sm text-white hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                        Logistica y Abastecimientos
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {[1].map((column) => (
  <div key={column}>
    <h4 className="text-sm font-semibold text-white mb-4">Especificaciones</h4>
    <ul className="space-y-4">
      <li className="space-y-1">
        <span className="font-semibold block">Modalidad</span>
        <ul className="ml-4 space-y-1">
          <li>Online - Presencial (de lunes a viernes)</li>
          <li>Semipresencial (solo sábados)</li>
        </ul>
      </li>
      <li className="space-y-1">
        <span className="font-semibold block">Duración</span>
        <ul className="ml-4">
          <li>2 años (6 cuatrimestres)</li>
        </ul>
      </li>
      <li className="space-y-1">
        <span className="font-semibold block">Sistema Modular</span>
      </li>
    </ul>
  </div>
))}
{[1].map((column) => (
              <div key={column}>
                <h4 className="text-sm font-semibold text-white mb-4">Navegación</h4>
                <ul className="space-y-3">
                  {[1].map((item) => (
                    <li key={item}>
                      <a href="https://ispi.edu.pa/modelo-academico-basado-en-competencias.aspx" className="text-sm text-white hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                        Modelo Académico
                      </a>
                    </li>
                  ))}
                  {[1].map((item) => (
                    <li key={item}>
                      <a href="https://ispi.edu.pa/certificaciones-internacionales.aspx" className="text-sm text-white hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                        Certificaciones Internacionales
                      </a>
                    </li>
                  ))}
                  {[1].map((item) => (
                    <li key={item}>
                      <a href="https://ispi.edu.pa/esam-global-talent.aspx" className="text-sm text-white hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                        ESAM Global Talent
                      </a>
                    </li>
                  ))}
                  {[1].map((item) => (
                    <li key={item}>
                      <a href="https://ispi.edu.pa/red-alumni.aspx" className="text-sm text-white hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                        Red Alumni
                      </a>
                    </li>
                  ))}
                  {[1].map((item) => (
                    <li key={item}>
                      <a href="https://ispi.edu.pa/terminos-y-condiciones.aspx" className="text-sm text-white hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                        Términos y Condiciones
                      </a>
                    </li>
                  ))}
                  {[1].map((item) => (
                    <li key={item}>
                      <a href="https://ispi.edu.pa/oferta-academica/tecnicos-superiores/tecnico-superior-en-gestion-de-operaciones.aspx" className="text-sm text-white hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                        Gestión de Operaciones
                      </a>
                    </li>
                  ))}
                  {[1].map((item) => (
                    <li key={item}>
                      <a href="https://ispi.edu.pa/oferta-academica/tecnicos-superiores/tecnico-superior-en-logistica-y-abastecimiento.aspx" className="text-sm text-white hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                        Logistica y Abastecimientos
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </
          div>
          <div className="mt-8 pt-8 border-t border-orange-700 flex justify-start space-x-6">
            {/* Facebook */}
            {/* <a href="#" className="text-orange-300 hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a> */}
            {/* LinkedIn */}
            {/* <a href="#" className="text-orange-300 hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a> */}
            {/* YouTube */}
            {/* <a href="#" className="text-orange-300 hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
            </a> */}
            {/* Instagram */}
            {/* <a href="#" className="text-orange-300 hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a> */}
          </div>
          <div className="mt-8 text-center text-orange-400 text-sm">
            © {new Date().getFullYear()} Instituto Superior Politécnico Internacional. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}

