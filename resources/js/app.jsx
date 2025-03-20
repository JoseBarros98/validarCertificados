import "./bootstrap"
import "../css/app.css"

import { createRoot } from "react-dom/client"
import { createInertiaApp } from "@inertiajs/react"
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers"

// Importa Ziggy una sola vez
import { Ziggy } from "./ziggy"

// Importar SweetAlert2 para estilos globales
import "sweetalert2/dist/sweetalert2.min.css"

// Configura Ziggy globalmente
window.Ziggy = Ziggy

const appName = window.document.getElementsByTagName("title")[0]?.innerText || "Validar Certificados"

createInertiaApp({
  title: (title) => `${title}`,
  resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob("./Pages/**/*.jsx")),
  setup({ el, App, props }) {
    const root = createRoot(el)
    root.render(<App {...props} />)
  },
  progress: {
    color: "#4B5563",
  },
})

