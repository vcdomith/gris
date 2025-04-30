'use client'

import { ReactNode, useState } from "react"
import Modal from "../Modal/Modal"
import { createPortal } from "react-dom"
import { AnimatePresence } from "motion/react"

type ValidActions = 'invite' | 'members'

interface ClientButtonProps {
    children: ReactNode
    className?: string
    
    render: ReactNode
}

const fns: Record<ValidActions, (() => void)> = {
    invite: () => alert('aaaa'),
    members: () => alert('nilve')
}

export default function ClientButton({ children , className = '', render }: ClientButtonProps) {

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
            <Modal closeFn={() => setActive(false)}>
                {active&& render}
            </Modal>,
            document.body,
        )}
        </>
    )

}