"use client"
import { Head, Link } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { route } from "ziggy-js"
import { QRCodeSVG } from "qrcode.react"
import { useState, useRef } from "react"

export default function Show({ auth, certificate }) {
  const [showQRModal, setShowQRModal] = useState(false)
  const qrCodeRef = useRef(null)

  // URL para validar el certificado
  const validationUrl = `${window.location.origin}?code=${certificate.code}`

  const downloadQRCode = () => {
    if (!qrCodeRef.current) return

    // Crear un canvas a partir del SVG
    const svg = qrCodeRef.current
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      // Descargar como PNG
      const pngFile = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.download = `certificado-${certificate.code}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
  }

  const printQRCode = () => {
    const printWindow = window.open("", "_blank")

    printWindow.document.write(`
      <html>
        <head>
          <title>Código QR - Certificado ${certificate.code}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
            }
            .container {
              max-width: 500px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 8px;
            }
            .qr-code {
              margin: 20px 0;
            }
            .info {
              margin-top: 20px;
              text-align: left;
            }
            h1 {
              color: #f97316;
            }
            p {
              margin: 5px 0;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #666;
            }
            @media print {
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Certificado ISPI</h1>
            <p>Escanea este código QR para verificar la autenticidad del certificado</p>
            <div class="qr-code">
              ${new XMLSerializer().serializeToString(qrCodeRef.current)}
            </div>
            <div class="info">
              <p><strong>Código:</strong> ${certificate.code}</p>
              <p><strong>Estudiante:</strong> ${certificate.student_name}</p>
              <p><strong>Curso:</strong> ${certificate.course_name}</p>
              <p><strong>Fecha de emisión:</strong> ${new Date(certificate.issue_date).toLocaleDateString()}</p>
            </div>
            <div class="footer">
              Instituto Superior Politécnico Internacional - Verificación de Certificados
            </div>
            <button class="no-print" onclick="window.print()">Imprimir</button>
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detalles del Certificado</h2>}
    >
      <Head title="Detalles del Certificado" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-medium text-gray-900">Información del Certificado</h3>
                <div className="flex space-x-2">
                  <Link
                    href={route("admin.certificates.edit", certificate.id)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Editar Certificado
                  </Link>
                  <Link
                    href={route("admin.certificates.index")}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Volver a la Lista
                  </Link>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <h4 className="font-medium text-gray-700 mb-2">Detalles Básicos</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Código</p>
                        <p className="font-medium">{certificate.code}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Estado</p>
                        <p
                          className={`font-medium ${certificate.status === "valid" ? "text-green-600" : "text-red-600"}`}
                        >
                          {certificate.status === "valid" ? "Válido" : "Inválido"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Estudiante</p>
                        <p className="font-medium">{certificate.student_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Curso</p>
                        <p className="font-medium">{certificate.course_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fecha de Emisión</p>
                        <p className="font-medium">{new Date(certificate.issue_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {certificate.certificate_image && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Imagen del Certificado</h4>
                      <div className="border rounded-md overflow-hidden">
                        <img
                          src={`/storage/${certificate.certificate_image}`}
                          alt="Certificado"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="bg-orange-50 p-6 rounded-md border border-orange-200">
                    <h4 className="font-medium text-orange-800 mb-4">Código QR para Validación</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Este código QR puede ser escaneado para validar la autenticidad del certificado. Al escanearlo, se
                      redirigirá a la página de validación con el código ya ingresado.
                    </p>

                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-white rounded-md shadow-sm border border-gray-200">
                        <QRCodeSVG
                          ref={qrCodeRef}
                          value={validationUrl}
                          size={200}
                          bgColor={"#ffffff"}
                          fgColor={"#000000"}
                          level={"H"}
                          includeMargin={true}
                        />
                      </div>
                    </div>

                    <div className="text-center text-sm text-gray-500 mb-4">
                      URL:{" "}
                      <a
                        href={validationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        {validationUrl}
                      </a>
                    </div>

                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={downloadQRCode}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Descargar QR
                      </button>
                      <button
                        onClick={printQRCode}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Imprimir QR
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

