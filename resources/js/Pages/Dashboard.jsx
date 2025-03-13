import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link } from "@inertiajs/react"
import { route } from "ziggy-js"

export default function Dashboard({ auth }) {
  // Resto del código...

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
    >
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">¡Bienvenido al panel de administración!</div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Gestión de Certificados</h3>
                <p className="text-gray-600 mb-4">
                  Administra los certificados educativos, añade nuevos o modifica los existentes.
                </p>
                <Link
                  href={route("admin.certificates.index")}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-700 active:bg-primary-700 focus:outline-none focus:border-primary-700 focus:shadow-outline-primary transition ease-in-out duration-150"
                >
                  Ir a Certificados
                </Link>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ver Página Principal</h3>
                <p className="text-gray-600 mb-4">Visita la página principal de validación de certificados.</p>
                <Link
                  href={route("home")}
                  className="inline-flex items-center px-4 py-2 bg-secondary-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-secondary-700 active:bg-secondary-700 focus:outline-none focus:border-secondary-700 focus:shadow-outline-secondary transition ease-in-out duration-150"
                >
                  Ir a Página Principal
                </Link>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Mi Perfil</h3>
                <p className="text-gray-600 mb-4">Administra tu información de perfil y configuración de seguridad.</p>
                <Link
                  href={route("profile.edit")}
                  className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray transition ease-in-out duration-150"
                >
                  Editar Perfil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

