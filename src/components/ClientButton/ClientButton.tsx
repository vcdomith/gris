'use client'

import { ReactNode } from "react"

type ValidActions = 'invite' | 'members'

interface ClientButtonProps {
    children: ReactNode
    className?: string
    action: ValidActions
}

const fns: Record<ValidActions, (() => void)> = {
    invite: () => alert('aaaa'),
    members: () => alert('nilve')
}

export default function ClientButton({ children , className = '', action }: ClientButtonProps) {

    return (
        <button
            onClick={() => fns[action]()}
            className={className}
        >
            {children}
        </button>
    )

}