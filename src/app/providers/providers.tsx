'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import { ReactNode, useState } from "react"
import { ModalProvider } from "../contexts/ModalContext"

export function Providers({ children }: { children: ReactNode }) {

    const [client] = useState(() => new QueryClient())

    return (
        <SessionProvider>
            <QueryClientProvider client={client}>
                <ModalProvider>
                    {children}
                </ModalProvider>
            </QueryClientProvider>
        </SessionProvider>)
}