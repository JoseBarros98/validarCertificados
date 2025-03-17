"use client"
import { Head, Link, useForm } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { route } from "ziggy-js"
import { useState } from "react"

export default function Index({ auth, users, flash }) {
  const { post } = useForm()
  const [confirmDelete, setConfirmDelete] = useState(null)

  const handleDelete = (id) => {
    if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      post(route("admin.users.destroy", id), {
        method: "delete",
      })
    }
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-orange-800 leading-tight">Gestión de Usuarios</h2>}
    >
      <Head title="Gestión de Usuarios" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              {flash?.message && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">{flash.message}</div>}
              {flash?.error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{flash.error}</div>}

              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Lista de Usuarios</h3>
                <Link
                  href={route("admin.users.create")}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Añadir Usuario
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
                        Nombre
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Rol
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
                    {users && users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.roles && user.roles.length > 0
                              ? user.roles.map((role) => (
                                  <span
                                    key={role.id}
                                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800"
                                  >
                                    {role.name}
                                  </span>
                                ))
                              : "Sin rol"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              href={route("admin.users.edit", user.id)}
                              className="text-orange-600 hover:text-orange-900 mr-4"
                            >
                              Editar
                            </Link>
                            {user.id !== auth.user.id && (
                              <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">
                                Eliminar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                          No hay usuarios registrados.
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

