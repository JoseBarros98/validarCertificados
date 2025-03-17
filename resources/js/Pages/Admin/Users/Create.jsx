"use client"
import { Head, useForm } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"
import { router } from "@inertiajs/react"
import { route } from "ziggy-js"

export default function Create({ auth, roles }) {
  const { data, setData, errors, processing } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    router.post(route("admin.users.store"), data)
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-orange-800 leading-tight">Crear Usuario</h2>}
    >
      <Head title="Crear Usuario" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <InputLabel htmlFor="name" value="Nombre" />
                  <TextInput
                    id="name"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                  />
                  <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mb-4">
                  <InputLabel htmlFor="email" value="Email" />
                  <TextInput
                    id="email"
                    type="email"
                    className="mt-1 block w-full"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    required
                  />
                  <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mb-4">
                  <InputLabel htmlFor="password" value="Contraseña" />
                  <TextInput
                    id="password"
                    type="password"
                    className="mt-1 block w-full"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    required
                  />
                  <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mb-4">
                  <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" />
                  <TextInput
                    id="password_confirmation"
                    type="password"
                    className="mt-1 block w-full"
                    value={data.password_confirmation}
                    onChange={(e) => setData("password_confirmation", e.target.value)}
                    required
                  />
                  <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mb-4">
                  <InputLabel htmlFor="role" value="Rol" />
                  <select
                    id="role"
                    className="mt-1 block w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                    value={data.role}
                    onChange={(e) => setData("role", e.target.value)}
                    required
                  >
                    <option value="">Seleccionar Rol</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  <InputError message={errors.role} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => router.get(route("admin.users.index"))}
                    className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400 active:bg-gray-400 focus:outline-none focus:border-gray-500 focus:shadow-outline-gray transition ease-in-out duration-150 mr-2"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-orange-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-orange-700 active:bg-orange-700 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange transition ease-in-out duration-150"
                    disabled={processing}
                  >
                    Guardar Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

