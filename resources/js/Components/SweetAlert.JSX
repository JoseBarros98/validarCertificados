import Swal from "sweetalert2"

// Función para mostrar una alerta de éxito
export const showSuccessAlert = (title, text = "") => {
  return Swal.fire({
    title: title,
    text: text,
    icon: "success",
    confirmButtonColor: "#10B981", // Color verde
    confirmButtonText: "Aceptar",
  })
}

// Función para mostrar una alerta de error
export const showErrorAlert = (title, text = "") => {
  return Swal.fire({
    title: title,
    text: text,
    icon: "error",
    confirmButtonColor: "#EF4444", // Color rojo
    confirmButtonText: "Aceptar",
  })
}

// Función para mostrar una confirmación
export const showConfirmation = (title, text, confirmButtonText = "Sí", cancelButtonText = "No", icon = "warning") => {
  return Swal.fire({
    title: title,
    text: text,
    icon: icon,
    showCancelButton: true,
    confirmButtonColor: "#10B981", // Color verde
    cancelButtonColor: "#EF4444", // Color rojo
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
  })
}

// Función para mostrar una alerta de carga
export const showLoadingAlert = (title = "Procesando...") => {
  return Swal.fire({
    title: title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    },
  })
}

// Función para cerrar la alerta actual
export const closeAlert = () => {
  Swal.close()
}

export default {
  showSuccessAlert,
  showErrorAlert,
  showConfirmation,
  showLoadingAlert,
  closeAlert,
}

