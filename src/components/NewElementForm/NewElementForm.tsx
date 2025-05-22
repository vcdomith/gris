'use client'
import { createElement, createPlaylist } from "@/app/actions/actions"
import { useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

export default function NewElementForm({
    element
}: {
    element: 'group' | 'playlist',
}) {

    const [submitting, setSubmitting] = useState(false)

    const router = useRouter()

    const { data: session } = useSession()
    if (!session || !session.user?.email) {
        redirect(`/api/auth/signin`)
    }

    const handleSubmit = async (e: FormEvent) => {

        setSubmitting(true)
        e.preventDefault();

        const formData = new FormData(e.currentTarget as HTMLFormElement)

        if (!session?.user?.email) {
            console.error('User is not defined')
            setSubmitting(false)
            return 
        }

        if (element === 'group') {
            await createElement(formData)
        } else {
            await createPlaylist(formData)   
        }
        setSubmitting(false)
        router.back()

    }

    return (
       
        <form 
            // action={createGroup}
            onSubmit={(e) => handleSubmit(e)}
            className="flex flex-col gap-2 h-full"
        >

            <span className="flex flex-col gap-2 w-full justify-center px-2 pb-4">

                <label htmlFor="name">Nome {(element === 'group') ? 'Grupo' : 'Playlist'}:</label>
                <input 
                    autoComplete="off"
                    autoCorrect="off"
                    type="text" 
                    placeholder="Nome" 
                    name="name"
                    required
                    className="border-2 border-amber-50/30 focus:border-amber-50/50 focus:outline-none px-2 rounded-sm"
                />

                {(element === 'playlist')&&
                <input 
                    autoComplete="off"
                    autoCorrect="off"
                    type="text" 
                    placeholder="Descrição (opcional)" 
                    name="desc"
                    className="border-2 border-amber-50/30 focus:border-amber-50/50 focus:outline-none px-2 rounded-sm"
                />
                }

                <input 
                    type="hidden" 
                    value={session.user.email} 
                    name="email"
                />

                <input 
                    type="hidden" 
                    value={element} 
                    name="element"
                />
                    

            </span>

            <button
                className={`flex gap-2 justify-center items-center mt-auto ml-auto px-2 max-w-[200px] border-2 border-amber-50/20 rounded bg-amber-50/20
                hover:bg-amber-50/30 transition-colors cursor-pointer disabled:text-amber-50/20 disabled:cursor-default disabled:bg-transparent disabled:border-amber-50/15 ${submitting ? 'animate-pulse' : ''}`}
                type="submit"
                disabled={submitting}
            >
                {submitting
            ? 
            <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-5 animate-spin`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" 
                />
                </svg>
                Criando...
            </>
            : `Criar`
            }
            </button>
    

        </form>
  
    )

}