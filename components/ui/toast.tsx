"use client"

import React, { createContext, useState, useCallback } from 'react'
import { Toast } from './toast-component'

type ToastType = {
  id: string
  title: string
  description: string
  variant?: 'default' | 'destructive'
}

type ToastContextType = {
  toasts: ToastType[]
  toast: (toast: Omit<ToastType, 'id'>) => void
  dismissToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastType[]>([])

  const toast = useCallback((newToast: Omit<ToastType, 'id'>) => {
    setToasts((prevToasts) => [...prevToasts, { ...newToast, id: Date.now().toString() }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismissToast }}>
      {children}
      <div className="fixed bottom-0 right-0 p-6 space-y-4">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onDismiss={() => dismissToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}