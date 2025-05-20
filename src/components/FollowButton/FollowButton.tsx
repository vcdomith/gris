'use client'

import { followPlaylist } from "@/app/actions/actions"
import { useState } from "react"
import { toast } from "sonner"

export default function FollowButton({ id }: { id: string }) {

    const [loading, setLoading] = useState(false)

    const handleClick = async () => {

        const followPromise = async (id: string) => {
            setLoading(true)
            try {
                await followPlaylist(id)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                throw error
            }
        }

        toast.promise(followPromise(id), {
            loading: 'Seguindo playlist...',
            success: 'Playlist seguida!',
            error: 'Erro ao seguir playlist!',
        })

    }

    return (
        <button 
            className='flex gap-1 items-center text-sm transition-colors hover:bg-amber-50/20 cursor-pointer rounded px-1 py-0.5 focus:outline-none focus:bg-amber-50/20 ml-auto'
            onClick={ () => handleClick() }
            disabled={loading}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
            <p className="hidden sm:block">
                Seguir
            </p>
        </button>
    )

}