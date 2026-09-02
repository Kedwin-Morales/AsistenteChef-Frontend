import Swal from "sweetalert2"
import 'sweetalert2/themes/material-ui.css'

export const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer
    toast.onmouseleave = Swal.resumeTimer
  }  
  
})

export const confirm = (options: {
  title: string
  text?: string
  confirmButtonText?: string
  cancelButtonText?: string
  icon?: 'warning' | 'question' | 'error' | 'info'
  isDarkMode?: boolean 
}) => Swal.fire({
  title: options.title,
  text: options.text,
  icon: options.icon ?? 'question',
  showCancelButton: true,
  confirmButtonText: options.confirmButtonText ?? 'Confirmar',
  cancelButtonText: options.cancelButtonText ?? 'Cancelar',
  reverseButtons: true,
  theme: options.isDarkMode ? 'dark' : 'light',
  customClass: {
    popup: 'mi-sweetalert'
  }
})

export const alert = (options: {
  title: string
  text?: string
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question'
  confirmButtonText?: string
}) => Swal.fire({
  title: options.title,
  text: options.text,
  icon: options.icon ?? 'info',
  confirmButtonText: options.confirmButtonText ?? 'OK'
})

export default Swal