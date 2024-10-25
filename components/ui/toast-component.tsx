"use client"

import React from 'react'
import { X } from 'lucide-react'

type ToastProps = {
  id: string
  title: string
  description: string
  variant?: 'default' | 'destructive'
  onDismiss: () => void
}

export const Toast: React.FC<ToastProps> = ({ title, description, variant = 'default', onDismiss }) => {
  return (
    <div className={`rounded-md p-4 ${variant === 'destructive' ? 'bg-red-600' : 'bg-gray-800'} text-white`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm">{description}</p>
        </div>
        <button onClick={onDismiss} className="text-white hover:text-gray-200">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}