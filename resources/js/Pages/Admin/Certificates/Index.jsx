"use client"
import { Head, Link, useForm } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { route } from "ziggy-js"
import { useState } from "react"

export default function Index({ auth, certificates, flash }) {
  const { post } = useForm()
  const [confirmDelete, setConfirmDelete] = useState(null)

  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "valid" ? "invalid" : "valid"
    const message =
      currentStatus === "valid"
        ? "¿Estás seguro de que quieres invalidar este certificado?"
        : "¿Estás seguro de que quieres validar este certificado?"

    if (confirm(message)) {
      post(route("admin.certificates.toggle-status", id))
    }
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Certificados</h2>}
    >
      <Head title="Gestión de Certificados" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              {flash?.message && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">{flash.message}</div>}

              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Lista de Certificados</h3>
                <Link
                  href={route("admin.certificates.create")}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Añadir Certificado
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Código
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Estudiante
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Curso
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Fecha de Emisión
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Estado
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Imagen
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {certificates && certificates.length > 0 ? (
                      certificates.map((certificate) => (
                        <tr key={certificate.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {certificate.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {certificate.student_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {certificate.course_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(certificate.issue_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                certificate.status === "valid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {certificate.status === "valid" ? "Válido" : "Inválido"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {certificate.certificate_image ? (
                              <a
                                href={`/storage/${certificate.certificate_image}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-900"
                              >
                                Ver imagen
                              </a>
                            ) : (
                              <span className="text-gray-400">Sin imagen</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              href={route("admin.certificates.edit", certificate.id)}
                              className="text-primary-600 hover:text-primary-900 mr-4"
                            >
                              Editar
                            </Link>
                            <button
                              onClick={() => handleToggleStatus(certificate.id, certificate.status)}
                              className={`${
                                certificate.status === "valid"
                                  ? "text-red-600 hover:text-red-900"
                                  : "text-green-600 hover:text-green-900"
                              }`}
                            >
                              {certificate.status === "valid" ? "Invalidar" : "Validar"}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                          No hay certificados registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

