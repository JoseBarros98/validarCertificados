"use client"

import { useEffect, useState } from "react"
import Checkbox from "@/Components/Checkbox"
import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"
import { Head, Link, useForm, router, usePage } from "@inertiajs/react"

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const { route } = usePage().props

  useEffect(() => {
    return () => {
      reset("password")
    }
  }, [])

  const submit = (e) => {
    e.preventDefault()
    router.post(route("login"), data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
      <Head title="Iniciar Sesión" />

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
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-orange-800">ISPI</h1>
          <p className="text-gray-600 text-sm">Instituto Superior Politécnico Internacional</p>
        </div>

        {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

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
              isFocused={true}
              onChange={(e) => setData("email", e.target.value)}
            />

            <InputError message={errors.email} className="mt-2" />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="password" value="Contraseña" className="text-gray-700" />

            <div className="relative">
              <TextInput
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                className="mt-1 block w-full border-orange-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                autoComplete="current-password"
                onChange={(e) => setData("password", e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                    <line x1="2" x2="22" y1="2" y2="22"></line>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>

            <InputError message={errors.password} className="mt-2" />
          </div>

          <div className="block mt-4">
            <label className="flex items-center">
              <Checkbox
                name="remember"
                checked={data.remember}
                onChange={(e) => setData("remember", e.target.checked)}
                className="rounded border-orange-300 text-orange-600 shadow-sm focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-600">Recordarme</span>
            </label>
          </div>

          <div className="flex items-center justify-end mt-4">
            {canResetPassword && (
              <Link
                href={route("password.request")}
                className="underline text-sm text-orange-600 hover:text-orange-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            )}

            <button
              type="submit"
              className="ml-4 inline-flex items-center px-4 py-2 bg-orange-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-orange-700 active:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition ease-in-out duration-150"
              disabled={processing}
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 text-center">
        <Link
          href={route("home")}
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
          Volver a la página principal
        </Link>
      </div>
    </div>
  )
}

