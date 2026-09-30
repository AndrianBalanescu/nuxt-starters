export interface ToastOptions {
  type?: 'info' | 'success' | 'warning' | 'error'
  duration?: number
}

declare global {
  interface Window {
    OHNO?: {
      toast: (msg: string, type?: string, opts?: { duration?: number }) => void
    }
  }
}

export function useToast() {
  function toast(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', duration = 3500) {
    if (typeof window !== 'undefined' && window.OHNO?.toast) {
      window.OHNO.toast(message, type, { duration })
    }
  }

  return {
    show: toast,
    info: (msg: string, duration?: number) => toast(msg, 'info', duration),
    success: (msg: string, duration?: number) => toast(msg, 'success', duration),
    warning: (msg: string, duration?: number) => toast(msg, 'warning', duration),
    error: (msg: string, duration?: number) => toast(msg, 'error', duration)
  }
}
