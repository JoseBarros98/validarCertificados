"use client"

import { useEffect } from "react"
import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"
import { Head, Link, useForm } from "@inertiajs/react"

export default function ResetPassword({ token, email }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    token: token,
    email: email,
    password: "",
    password_confirmation: "",
  })

  useEffect(() => {
    return () => {
      reset("password", "password_confirmation")
    }
  }, [])

  const submit = (e) => {
    e.preventDefault()
    post(route("password.store"))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
      <Head title="Restablecer Contraseña" />

      <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-10 h-10 text-white"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              <circle cx="12" cy="16" r="1"></circle>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-orange-800">ISPI</h1>
          <p className="text-gray-600 text-sm">Restablecer Contraseña</p>
        </div>

        <form onSubmit={submit}>
          <div>
            <InputLabel htmlFor="email" value="Correo Electrónico" className="text-gray-700" />

            <TextInput
              id="email"
              type="email"
              name="email"
              value={data.email}
              className="mt-1 block w-full border-orange-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
              autoComplete="username"
              onChange={(e) => setData("email", e.target.value)}
              readOnly
            />

            <InputError message={errors.email} className="mt-2" />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="password" value="Nueva Contraseña" className="text-gray-700" />

            <TextInput
              id="password"
              type="password"
              name="password"
              value={data.password}
              className="mt-1 block w-full border-orange-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
              autoComplete="new-password"
              isFocused={true}
              onChange={(e) => setData("password", e.target.value)}
            />

            <InputError message={errors.password} className="mt-2" />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" className="text-gray-700" />

            <TextInput
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              value={data.password_confirmation}
              className="mt-1 block w-full border-orange-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
              autoComplete="new-password"
              onChange={(e) => setData("password_confirmation", e.target.value)}
            />

            <InputError message={errors.password_confirmation} className="mt-2" />
          </div>

          <div className="flex items-center justify-end mt-4">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-orange-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-orange-700 active:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition ease-in-out duration-150"
              disabled={processing}
            >
              Restablecer Contraseña
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 text-center">
        <Link
          href={route("login")}
          className="text-sm text-orange-600 hover:text-orange-900 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7"></path>
            <path d="M19 12H5"></path>
          </svg>
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  )
}

