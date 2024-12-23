'use client'

import {ReactNode} from 'react'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    description?: string
    children: ReactNode
    className?: string
    autofocus?: boolean
}

export function Modal({isOpen, onClose, title, description, children, className = '', autofocus = true}: ModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent onOpenAutoFocus={(e) => {
                if (!autofocus) {
                    e.preventDefault()
                }
            }}
                           className={`sm:max-w-[425px] ${className} bg-background`}>
                <>
                    {(title || description) && (
                        <DialogHeader>
                            <>
                                {title && <DialogTitle>{title}</DialogTitle>}
                                {description && <DialogDescription>{description}</DialogDescription>}
                            </>
                        </DialogHeader>
                    )}</>
                {children}
            </DialogContent>
        </Dialog>
    )
}

