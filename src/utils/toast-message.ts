import { toast } from 'react-toastify'

type ToastMessageProps = {
    message: string
    type: 'error' | 'success' | 'warning' | 'info'
}

export const toastMessage = ({ message, type }: ToastMessageProps) => {
    toast(message, {
        position: 'top-right',
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        type: type,
    })
}
