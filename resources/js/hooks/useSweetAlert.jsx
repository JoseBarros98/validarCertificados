import Swal from "sweetalert2"

export function useSweetAlert() {
  const toast = (icon, title) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer)
        toast.addEventListener("mouseleave", Swal.resumeTimer)
      },
    })

    Toast.fire({
      icon,
      title,
    })
  }

  const success = (title) => toast("success", title)
  const error = (title) => toast("error", title)
  const warning = (title) => toast("warning", title)
  const info = (title) => toast("info", title)

  const confirm = async (options) => {
    const result = await Swal.fire({
      title: options.title || "¿Estás seguro?",
      text: options.text || "Esta acción no se puede revertir.",
      icon: options.icon || "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316", // Color naranja primario
      cancelButtonColor: "#6b7280", // Color gris
      confirmButtonText: options.confirmButtonText || "Sí, continuar",
      cancelButtonText: options.cancelButtonText || "Cancelar",
    })

    return result.isConfirmed
  }

  return {
    toast,
    success,
    error,
    warning,
    info,
    confirm,
    swal: Swal,
  }
}

