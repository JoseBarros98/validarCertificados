"use client"

import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"
import { Head, Link, useForm } from "@inertiajs/react"

export default function ForgotPassword({ status }) {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
  })

  const submit = (e) => {
    e.preventDefault()
    post(route("password.email"))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
      <Head title="Recuperar Contraseña" />

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
              <rect width="16" height="13" x="4" y="5" rx="2"></rect>
              <path d="m22 5-8 5-8-5"></path>
              <path d="M20 18h-8"></path>
              <path d="M12 18h-4"></path>
              <path d="M12 13v5"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-orange-800">ISPI</h1>
          <p className="text-gray-600 text-sm">Recuperación de Contraseña</p>
        </div>

        <div className="mb-4 text-sm text-gray-600">
          ¿Olvidaste tu contraseña? No hay problema. Simplemente indícanos tu dirección de correo electrónico y te
          enviaremos un enlace para restablecer tu contraseña.
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
              isFocused={true}
              onChange={(e) => setData("email", e.target.value)}
            />

            <InputError message={errors.email} className="mt-2" />
          </div>

          <div className="flex items-center justify-between mt-4">
            <Link
              href={route("login")}
              className="underline text-sm text-orange-600 hover:text-orange-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Volver al inicio de sesión
            </Link>

            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-orange-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-orange-700 active:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition ease-in-out duration-150"
              disabled={processing}
            >
              Enviar enlace
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

