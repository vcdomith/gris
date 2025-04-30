'use client'

import { ComponentType, Dispatch, ReactNode, SetStateAction, useState } from "react"
import Modal from "../Modal/Modal"
import { createPortal } from "react-dom"

interface ClientButtonProps {
    children: ReactNode
    className?: string
    title?: string
    
    // RenderComponent: ComponentType<{ close: () => void }>
    render: ReactNode
}

export default function ClientButton({ children , className = '', render, title = '' }: ClientButtonProps) {

    const [active, setActive] = useState(false)

    return (
        <>
        <button
            onClick={() => setActive(true)}
            className={className}
        >
            {children}
        </button>
        {active&&
        createPortal(
            <Modal 
                closeFn={() => setActive(false)}
                header={(title !== '')? title : ''}
                size='small'
            >
                {active&& render}
            </Modal>,
            document.body,
        )}
        </>
    )

}
