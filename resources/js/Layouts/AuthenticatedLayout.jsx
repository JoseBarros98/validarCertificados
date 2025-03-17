"use client"

import { useState } from "react"
import Dropdown from "@/Components/Dropdown"
import NavLink from "@/Components/NavLink"
import ResponsiveNavLink from "@/Components/ResponsiveNavLink"
import { Link } from "@inertiajs/react"
import { route } from "ziggy-js"

export default function Authenticated({ user, header, children }) {
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false)

  // Verificar si el usuario está definido
  if (!user) {
    // Redirigir al login o mostrar un mensaje
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-orange-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-orange-800 mb-4">Sesión expirada</h2>
          <p className="text-gray-600 mb-6">
            Tu sesión ha expirado o no has iniciado sesión. Por favor, inicia sesión nuevamente para continuar.
          </p>
          <Link
            href={route("login")}
            className="w-full inline-flex justify-center items-center px-4 py-2 bg-orange-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition ease-in-out duration-150"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  // Verificar si el usuario tiene un permiso específico
  const hasPermission = (permission) => {
    // Verificación más robusta para evitar errores
    if (!user || !user.permissions) {
      console.log("Usuario o permisos no definidos:", user)
      return false
    }
    return user.permissions.includes(permission)
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <nav className="bg-white border-b border-orange-200 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="shrink-0 flex items-center">
                <Link href="/">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-6 h-6 text-white"
                      >
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                      </svg>
                    </div>
                    <span className="text-xl font-bold text-orange-800">ISPI</span>
                  </div>
                </Link>
              </div>

              <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                <NavLink href={route("dashboard")} active={route().current("dashboard")}>
                  Dashboard
                </NavLink>

                {hasPermission("view certificates") && (
                  <NavLink
                    href={route("admin.certificates.index")}
                    active={route().current("admin.certificates.index")}
                  >
                    Certificados
                  </NavLink>
                )}

                {hasPermission("create certificates") && (
                  <NavLink
                    href={route("admin.certificates.create")}
                    active={route().current("admin.certificates.create")}
                  >
                    Crear Certificado
                  </NavLink>
                )}

                {hasPermission("create users") && (
                  <NavLink href={route("admin.users.index")} active={route().current("admin.users.index")}>
                    Usuarios
                  </NavLink>
                )}
              </div>
            </div>

            <div className="hidden sm:flex sm:items-center sm:ml-6">
              <div className="ml-3 relative">
                <Dropdown>
                  <Dropdown.Trigger>
                    <span className="inline-flex rounded-md">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-2">
                            <span className="text-orange-600 font-semibold">{user.name.charAt(0).toUpperCase()}</span>
                          </div>
                          {user.name}
                        </div>

                        <svg
                          className="ml-2 -mr-0.5 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </span>
                  </Dropdown.Trigger>

                  <Dropdown.Content>
                    <Dropdown.Link href={route("profile.edit")}>Perfil</Dropdown.Link>
                    <Dropdown.Link href={route("logout")} method="post" as="button">
                      Cerrar Sesión
                    </Dropdown.Link>
                  </Dropdown.Content>
                </Dropdown>
              </div>
            </div>

            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path
                    className={!showingNavigationDropdown ? "inline-flex" : "hidden"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                  <path
                    className={showingNavigationDropdown ? "inline-flex" : "hidden"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className={(showingNavigationDropdown ? "block" : "hidden") + " sm:hidden"}>
          <div className="pt-2 pb-3 space-y-1">
            <ResponsiveNavLink href={route("dashboard")} active={route().current("dashboard")}>
              Dashboard
            </ResponsiveNavLink>

            {hasPermission("view certificates") && (
              <ResponsiveNavLink
                href={route("admin.certificates.index")}
                active={route().current("admin.certificates.index")}
              >
                Certificados
              </ResponsiveNavLink>
            )}

            {hasPermission("create certificates") && (
              <ResponsiveNavLink
                href={route("admin.certificates.create")}
                active={route().current("admin.certificates.create")}
              >
                Crear Certificado
              </ResponsiveNavLink>
            )}

            {hasPermission("create users") && (
              <ResponsiveNavLink href={route("admin.users.index")} active={route().current("admin.users.index")}>
                Usuarios
              </ResponsiveNavLink>
            )}
          </div>

          <div className="pt-4 pb-1 border-t border-gray-200">
            <div className="px-4">
              <div className="font-medium text-base text-gray-800">{user.name}</div>
              <div className="font-medium text-sm text-gray-500">{user.email}</div>
            </div>

            <div className="mt-3 space-y-1">
              <ResponsiveNavLink href={route("profile.edit")}>Perfil</ResponsiveNavLink>
              <ResponsiveNavLink method="post" href={route("logout")} as="button">
                Cerrar Sesión
              </ResponsiveNavLink>
            </div>
          </div>
        </div>
      </nav>

      {header && (
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
        </header>
      )}

      <main>{children}</main>

      <footer className="bg-white border-t border-orange-200 mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Instituto Superior Politécnico Internacional
            </div>
            <div className="text-sm text-gray-500">Panel de Administración v1.0.0</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

