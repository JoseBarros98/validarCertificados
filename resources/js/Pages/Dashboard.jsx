"use client"

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link } from "@inertiajs/react"
import { route } from "ziggy-js"

export default function Dashboard({ auth, stats }) {
  // Verificar si el usuario tiene un permiso específico
  const hasPermission = (permission) => {
    // Verificación más robusta para evitar errores
    if (!auth || !auth.user || !auth.user.permissions) {
      console.log("Usuario o permisos no definidos:", auth?.user)
      return false
    }
    return auth.user.permissions.includes(permission)
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex flex-col space-y-1">
          <h2 className="font-semibold text-xl text-orange-800 leading-tight">Dashboard</h2>
          <p className="text-sm text-orange-600">Bienvenido al panel de administración de certificados</p>
        </div>
      }
    >
      <Head title="Dashboard" />

      <div className="py-12 bg-orange-50">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border-l-4 border-orange-500">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100 mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-orange-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total de Certificados</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalCertificates}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border-l-4 border-green-500">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Certificados Válidos</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.validCertificates}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border-l-4 border-red-500">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-100 mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Certificados Inválidos</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.invalidCertificates}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Acciones Rápidas */}
            <div className="lg:col-span-1">
              <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-orange-800 mb-4">Acciones Rápidas</h3>

                  <div className="space-y-3">
                    {hasPermission("create certificates") && (
                      <Link
                        href={route("admin.certificates.create")}
                        className="flex items-center p-3 bg-orange-50 hover:bg-orange-100 rounded-md transition-colors"
                      >
                        <div className="p-2 bg-orange-100 rounded-md mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-orange-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Crear Nuevo Certificado</span>
                      </Link>
                    )}

                    {hasPermission("view certificates") && (
                      <Link
                        href={route("admin.certificates.index")}
                        className="flex items-center p-3 bg-orange-50 hover:bg-orange-100 rounded-md transition-colors"
                      >
                        <div className="p-2 bg-orange-100 rounded-md mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-orange-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">Gestionar Certificados</span>
                      </Link>
                    )}

                    <Link
                      href={route("home")}
                      className="flex items-center p-3 bg-orange-50 hover:bg-orange-100 rounded-md transition-colors"
                      target="_blank"
                    >
                      <div className="p-2 bg-orange-100 rounded-md mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-orange-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">Ver Página Principal</span>
                    </Link>

                    {hasPermission("create users") && (
                      <Link
                        href={route("admin.users.index")}
                        className="flex items-center p-3 bg-orange-50 hover:bg-orange-100 rounded-md transition-colors"
                      >
                        <div className="p-2 bg-orange-100 rounded-md mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-orange-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">Gestionar Usuarios</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Información del Sistema */}
              <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-orange-800 mb-4">Información del Sistema</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Último Acceso</span>
                      <span className="text-gray-800 font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Usuario</span>
                      <span className="text-gray-800 font-medium">{auth.user.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rol</span>
                      <span className="text-gray-800 font-medium">
                        {auth.user.roles && auth.user.roles.length > 0 ? auth.user.roles[0] : "Sin rol"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Usuarios</span>
                      <span className="text-gray-800 font-medium">{stats.userCount || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actividad Reciente y Gráfico */}
            <div className="lg:col-span-2 space-y-6">
              {/* Actividad Reciente */}
              <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-orange-800 mb-4">Actividad Reciente</h3>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Acción
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Certificado
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
                            Fecha
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stats.recentActivity && stats.recentActivity.length > 0 ? (
                          stats.recentActivity.map((activity, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {activity.action}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {activity.certificate}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {activity.student_name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.date}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                              No hay actividad reciente.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Gráfico o Información Adicional */}
              <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-orange-800 mb-4">Resumen de Certificados</h3>

                  {stats.totalCertificates > 0 ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="flex items-center space-x-8">
                        <div className="flex flex-col items-center">
                          <div className="w-32 h-32 rounded-full border-8 border-orange-500 flex items-center justify-center">
                            <span className="text-3xl font-bold text-orange-800">
                              {Math.round((stats.validCertificates / stats.totalCertificates) * 100)}%
                            </span>
                          </div>
                          <span className="mt-2 text-gray-600">Certificados Válidos</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="w-32 h-32 rounded-full border-8 border-red-500 flex items-center justify-center">
                            <span className="text-3xl font-bold text-red-800">
                              {Math.round((stats.invalidCertificates / stats.totalCertificates) * 100)}%
                            </span>
                          </div>
                          <span className="mt-2 text-gray-600">Certificados Inválidos</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <p className="text-gray-500">No hay certificados registrados aún.</p>
                    </div>
                  )}

                  {/* Distribución por mes */}
                  {stats.certificatesByMonth && stats.certificatesByMonth.length > 0 && (
                    <div className="mt-8">
                      <h4 className="text-md font-medium text-gray-700 mb-4">Certificados por mes</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Mes
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Válidos
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Inválidos
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {stats.certificatesByMonth.map((item, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {item.month} {item.year}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                                  {item.valid}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                                  {item.invalid}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                  {item.total}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

