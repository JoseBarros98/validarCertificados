"use client"
import { Head, useForm } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"
import { router } from "@inertiajs/react"
import { route } from "ziggy-js"
import { useState } from "react"
import { useSweetAlert } from "@/hooks/useSweetAlert"

export default function Create({ auth }) {
  const [imagePreview, setImagePreview] = useState(null)
  const sweetAlert = useSweetAlert()

  const { data, setData, errors, processing } = useForm({
    code: "",
    student_name: "",
    course_name: "",
    issue_date: "",
    status: "valid",
    certificate_image: null,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    router.post(route("admin.certificates.store"), data, {
      forceFormData: true,
      onSuccess: () => {
        sweetAlert.success("Certificado creado correctamente")
      },
      onError: () => {
        sweetAlert.error("Error al crear el certificado")
      },
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setData("certificate_image", file)

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
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
            <div className="p-6 bg-white border-b border-gray-200">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <InputLabel htmlFor="code" value="Código del Certificado" />
                  <TextInput
                    id="code"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.code}
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
                    className="mt-1 block w-full"
                    value={data.student_name}
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
                    className="mt-1 block w-full"
                    value={data.course_name}
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
                    className="mt-1 block w-full"
                    value={data.issue_date}
                    onChange={(e) => setData("issue_date", e.target.value)}
                    required
                  />
                  <InputError message={errors.issue_date} className="mt-2" />
                </div>

                <div className="mb-4">
                  <InputLabel htmlFor="status" value="Estado" />
                  <select
                    id="status"
                    className="mt-1 block w-full border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                    value={data.status}
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Sube una imagen del certificado. Esta imagen se mostrará cuando se valide el certificado.
                  </p>
                  <InputError message={errors.certificate_image} className="mt-2" />

                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                      <img
                        src={imagePreview || "https://placehold.co/600x400/CCCCCC/666666"}
                        alt="Vista previa del certificado"
                        className="max-w-full h-auto max-h-64 border rounded-md"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => router.get(route("admin.certificates.index"))}
                    className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400 active:bg-gray-400 focus:outline-none focus:border-gray-500 focus:shadow-outline-gray transition ease-in-out duration-150 mr-2"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-700 active:bg-primary-700 focus:outline-none focus:border-primary-700 focus:shadow-outline-primary transition ease-in-out duration-150"
                    disabled={processing}
                  >
                    Guardar Certificado
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

