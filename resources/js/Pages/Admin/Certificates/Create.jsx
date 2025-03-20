"use client"

import { useState } from "react"
import { Head, useForm } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"
import PrimaryButton from "@/Components/PrimaryButton"
import { showLoadingAlert, closeAlert, showSuccessAlert, showErrorAlert } from "@/Components/SweetAlert"

export default function Create({ auth }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    code: "",
    student_name: "",
    course_name: "",
    issue_date: "",
    status: "valid", // Valor predeterminado: válido
    certificate_image: null,
  })

  const [previewUrl, setPreviewUrl] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    // Verificar que todos los campos requeridos estén completos
    if (!data.code || !data.student_name || !data.course_name || !data.issue_date) {
      showErrorAlert("Campos incompletos", "Por favor complete todos los campos requeridos")
      return
    }

    // Mostrar alerta de carga
    showLoadingAlert("Creando certificado...")

    post("/admin/certificates", {
      onSuccess: () => {
        // Cerrar alerta de carga
        closeAlert()

        // Mostrar alerta de éxito
        showSuccessAlert("¡Certificado creado!", "El certificado ha sido creado exitosamente.").then(() => {
          // Redirigir a la lista de certificados
          window.location.href = "/admin/certificates"
        })

        reset()
      },
      onError: (errors) => {
        // Cerrar alerta de carga
        closeAlert()

        // Mostrar alerta de error
        showErrorAlert("Error", "Ocurrió un error al crear el certificado. Por favor intente nuevamente.")
        console.error("Error al crear certificado:", errors)
      },
      preserveScroll: true,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setData("certificate_image", file)

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target.result)
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Crear Certificado</h2>}
    >
      <Head title="Crear Certificado" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-4">
                  <InputLabel htmlFor="code" value="Código del Certificado" />
                  <TextInput
                    id="code"
                    type="text"
                    name="code"
                    value={data.code}
                    className="mt-1 block w-full"
                    onChange={(e) => setData("code", e.target.value)}
                    required
                  />
                  <InputError message={errors.code} className="mt-2" />
                </div>

                <div className="mb-4">
                  <InputLabel htmlFor="student_name" value="Nombre del Estudiante" />
                  <TextInput
                    id="student_name"
                    type="text"
                    name="student_name"
                    value={data.student_name}
                    className="mt-1 block w-full"
                    onChange={(e) => setData("student_name", e.target.value)}
                    required
                  />
                  <InputError message={errors.student_name} className="mt-2" />
                </div>

                <div className="mb-4">
                  <InputLabel htmlFor="course_name" value="Nombre del Curso" />
                  <TextInput
                    id="course_name"
                    type="text"
                    name="course_name"
                    value={data.course_name}
                    className="mt-1 block w-full"
                    onChange={(e) => setData("course_name", e.target.value)}
                    required
                  />
                  <InputError message={errors.course_name} className="mt-2" />
                </div>

                <div className="mb-4">
                  <InputLabel htmlFor="issue_date" value="Fecha de Emisión" />
                  <TextInput
                    id="issue_date"
                    type="date"
                    name="issue_date"
                    value={data.issue_date}
                    className="mt-1 block w-full"
                    onChange={(e) => setData("issue_date", e.target.value)}
                    required
                  />
                  <InputError message={errors.issue_date} className="mt-2" />
                </div>

                <div className="mb-4">
                  <InputLabel htmlFor="status" value="Estado del Certificado" />
                  <select
                    id="status"
                    name="status"
                    value={data.status}
                    className="mt-1 block w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                    onChange={(e) => setData("status", e.target.value)}
                    required
                  >
                    <option value="valid">Válido</option>
                    <option value="invalid">Inválido</option>
                  </select>
                  <InputError message={errors.status} className="mt-2" />
                </div>

                <div className="mb-4">
                  <InputLabel htmlFor="certificate_image" value="Imagen del Certificado" />
                  <input
                    id="certificate_image"
                    type="file"
                    name="certificate_image"
                    className="mt-1 block w-full"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  <InputError message={errors.certificate_image} className="mt-2" />

                  {previewUrl && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Vista previa"
                        className="max-w-full h-auto max-h-64 rounded-md"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end mt-4">
                  
                  <PrimaryButton type="submit" disabled={processing} className="inline-flex items-center px-4 py-2 bg-orange-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-orange-700 active:bg-orange-700 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange transition ease-in-out duration-150">
                    {processing ? "Creando..." : "Crear Certificado"}
                  </PrimaryButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

