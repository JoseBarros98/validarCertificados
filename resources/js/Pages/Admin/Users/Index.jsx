"use client"
import { Head, Link, useForm } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { route } from "ziggy-js"
import { useState } from "react"
import { useSweetAlert } from "@/hooks/useSweetAlert"
import { router } from "@inertiajs/react"

export default function Index({ auth, users, flash, filters }) {
  const { delete: destroy } = useForm()
  const [search, setSearch] = useState(filters.search || "")
  const sweetAlert = useSweetAlert()

  const handleDelete = async (id) => {
    const confirmed = await sweetAlert.confirm({
      title: "Eliminar usuario",
      text: "¿Estás seguro de que quieres eliminar este usuario?",
      icon: "warning",
    })

    if (confirmed) {
      destroy(route("admin.users.destroy", id), {
        onSuccess: () => {
          sweetAlert.success("Usuario eliminado correctamente")
        },
        onError: () => {
          sweetAlert.error("Error al eliminar el usuario")
        },
      })
    }
  }

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    e.preventDefault()
    router.get(route("admin.users.index"), { search }, { preserveState: true })
  }

  // Función para limpiar la búsqueda
  const clearSearch = () => {
    setSearch("")
    router.get(route("admin.users.index"), { search: "" }, { preserveState: true })
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

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h3 className="text-lg font-medium text-gray-900">Lista de Usuarios</h3>

                {/* Buscador */}
                <div className="w-full md:w-auto flex flex-1 md:flex-initial">
                  <form onSubmit={handleSearch} className="flex w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        className="w-full rounded-l-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
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
                      className="bg-orange-600 text-white px-4 py-2 rounded-r-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
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
                </div>

                <Link
                  href={route("admin.users.create")}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 whitespace-nowrap"
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
                          {filters.search
                            ? `No se encontraron usuarios que coincidan con "${filters.search}"`
                            : "No hay usuarios registrados."}
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