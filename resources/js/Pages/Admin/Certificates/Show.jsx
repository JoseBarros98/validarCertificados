"use client"
import { Head, Link, router } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import PrimaryButton from "@/Components/PrimaryButton"
import SecondaryButton from "@/Components/SecondaryButton"
import DangerButton from "@/Components/DangerButton"
import {
  showConfirmation,
  showSuccessAlert,
  showErrorAlert,
  showLoadingAlert,
  closeAlert,
} from "@/Components/SweetAlert"

export default function Show({ auth, certificate }) {
  const toggleStatus = () => {
    const newStatus = certificate.status === "valid" ? "invalid" : "valid"
    const action = certificate.status === "valid" ? "invalidar" : "validar"

    showConfirmation(
      `¿${action.charAt(0).toUpperCase() + action.slice(1)} certificado?`,
      `¿Estás seguro de que deseas ${action} este certificado? Esta acción cambiará el estado del certificado.`,
      "Sí, continuar",
      "Cancelar",
    ).then((result) => {
      if (result.isConfirmed) {
        // Mostrar alerta de carga
        showLoadingAlert(`${action.charAt(0).toUpperCase() + action.slice(1)}ando certificado...`)

        router.post(
          `/admin/certificates/${certificate.id}/toggle-status`,
          {},
          {
            onSuccess: () => {
              // Cerrar alerta de carga
              closeAlert()

              // Mostrar alerta de éxito
              showSuccessAlert("Estado actualizado", `El certificado ha sido ${action}ado exitosamente.`).then(() => {
                // Recargar la página para mostrar el nuevo estado
                router.reload()
              })
            },
            onError: (error) => {
              // Cerrar alerta de carga
              closeAlert()

              // Mostrar alerta de error
              showErrorAlert("Error", `Ocurrió un error al ${action} el certificado. Por favor intente nuevamente.`)
            },
          },
        )
      }
    })
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Ver Certificado</h2>}
    >
      <Head title="Ver Certificado" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="mb-6">
                <Link href="/admin/certificates">
                  <SecondaryButton>← Volver a la lista</SecondaryButton>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles del Certificado</h3>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500">Código:</p>
                      <p className="mt-1 text-sm text-gray-900">{certificate.code}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500">Estudiante:</p>
                      <p className="mt-1 text-sm text-gray-900">{certificate.student_name}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500">Curso:</p>
                      <p className="mt-1 text-sm text-gray-900">{certificate.course_name}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500">Fecha de Emisión:</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(certificate.issue_date).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500">Estado:</p>
                      <p className="mt-1">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            certificate.status === "valid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {certificate.status === "valid" ? "Válido" : "Inválido"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-3">
                    <Link href={`/admin/certificates/${certificate.id}/edit`}>
                      <PrimaryButton>Editar</PrimaryButton>
                    </Link>
                    <a
                      href={`/api/download-certificate/${certificate.id}`}
                      target="_blank"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors"
                      rel="noreferrer"
                    >
                      Descargar con QR
                    </a>
                    <DangerButton onClick={toggleStatus}>
                      {certificate.status === "valid" ? "Invalidar" : "Validar"}
                    </DangerButton>
                  </div>
                </div>

                {certificate.certificate_image && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Imagen del Certificado</h3>
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
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

