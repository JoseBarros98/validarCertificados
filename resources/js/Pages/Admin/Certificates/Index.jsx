"use client"
import { Head, Link, useForm } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { route } from "ziggy-js"
import { useState } from "react"
import { useSweetAlert } from "@/hooks/useSweetAlert"
import { router } from "@inertiajs/react"

export default function Index({ auth, certificates, flash, filters }) {
  const { post } = useForm()
  const [search, setSearch] = useState(filters.search || "")
  const [status, setStatus] = useState(filters.status || "")
  const [confirmDelete, setConfirmDelete] = useState(null)
  const sweetAlert = useSweetAlert()

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "valid" ? "invalid" : "valid"
    const message =
      currentStatus === "valid"
        ? "¿Estás seguro de que quieres invalidar este certificado?"
        : "¿Estás seguro de que quieres validar este certificado?"

    const confirmed = await sweetAlert.confirm({
      title: currentStatus === "valid" ? "Invalidar certificado" : "Validar certificado",
      text: message,
      icon: "warning",
    })

    if (confirmed) {
      post(
        route("admin.certificates.toggle-status", id),
        {},
        {
          onSuccess: () => {
            sweetAlert.success(
              currentStatus === "valid" ? "Certificado invalidado correctamente" : "Certificado validado correctamente",
            )
          },
          onError: () => {
            sweetAlert.error("Error al cambiar el estado del certificado")
          },
        },
      )
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    router.get(route("admin.certificates.index"), { search, status }, { preserveState: true })
  }

  const clearSearch = () => {
    setSearch("")
    router.get(route("admin.certificates.index"), { search: "", status }, { preserveState: true })
  }

  const handleStatusChange = (e) => {
    const newStatus = e.target.value
    setStatus(newStatus)
    router.get(route("admin.certificates.index"), { search, status: newStatus }, { preserveState: true })
  }

  const hasPermission = (permission) => {
    if (!auth || !auth.user || !auth.user.permissions) {
      console.log("Usuario o permisos no definidos:", auth?.user)
      return false
    }
    return auth.user.permissions.includes(permission)
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

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h3 className="text-lg font-medium text-gray-900">Lista de Certificados</h3>

                <div className="w-full md:w-auto flex flex-col md:flex-row gap-2 flex-1 md:flex-initial">
                  {/* Buscador */}
                  <form onSubmit={handleSearch} className="flex w-full">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Buscar por código, estudiante o curso..."
                        className="w-full rounded-l-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      {search && (
                        <button
                          type="button"
                          onClick={clearSearch}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="bg-primary-600 text-white px-4 py-2 rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </form>

                  {/* Filtro de estado */}
                  <select
                    value={status}
                    onChange={handleStatusChange}
                    className="rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  >
                    <option value="">Todos los estados</option>
                    <option value="valid">Válidos</option>
                    <option value="invalid">Inválidos</option>
                  </select>
                </div>

                {hasPermission("create certificates") && (
                  <Link
                    href={route("admin.certificates.create")}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 whitespace-nowrap"
                  >
                    Añadir Certificado
                  </Link>
                )}
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
                              href={route("admin.certificates.show", certificate.id)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Ver QR
                            </Link>
                            {hasPermission("edit certificates") && (
                              <Link
                                href={route("admin.certificates.edit", certificate.id)}
                                className="text-primary-600 hover:text-primary-900 mr-4"
                              >
                                Editar
                              </Link>
                            )}
                            {hasPermission("toggle certificate status") && (
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
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                          {filters.search || filters.status
                            ? `No se encontraron certificados que coincidan con los criterios de búsqueda.`
                            : "No hay certificados registrados."}
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
