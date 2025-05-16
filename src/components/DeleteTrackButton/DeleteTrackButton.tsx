'use client'

import { removeTrack } from "@/app/actions/actions"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

interface DeleteTrackButtonProps {
    playlistId: string
    trackUri: string
    snapshotId: string
}

export function DeleteTrackButton({ playlistId, trackUri, snapshotId }: DeleteTrackButtonProps) {
    
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleDelete = () => {
        startTransition(async () => {
            try {
                await removeTrack(playlistId, trackUri, snapshotId)
                router.refresh()
                
                setTimeout(() => {
                    toast.success('Música removida com sucesso!')
                }, 2000)

            } catch (error) {
                toast.error('Erro ao remover música!')
            }
        })
    }

    return (
        <button 
            onClick={() => handleDelete()}
            disabled={isPending}
            className="group bg-transparent transition-colors cursor-pointer rounded p-0.5"
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 stroke-amber-50/50 group-disabled:stroke-amber-50/10 group-hover:stroke-amber-50/80 transition-colors">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
        </button>
    )

}