'use client'
import { usePathname } from "next/navigation";
import EmptyMessage from "../EmptyMessage/EmptyMessage";
import Link from "next/link";
import { toast } from "sonner";
import { useModal } from "@/app/contexts/ModalContext";


export default function Invite({ token }: { token: string } ) {

    const url = `${window.location.origin}/groups/invite/${token}`
    console.log(url);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url)
            toast.success('Link copiado com sucesso!')
            close()
        } catch (error) {
            toast.error('Erro ao copiar')
        }
    }

    return (
    
        <>
        <button 
            onClick={() => copyToClipboard()}
            className="flex justify-center items-center gap-2 py-2 border-2 border-amber-50/20 bg-amber-50/80 hover:bg-amber-50/90 text-neutral-800 transition-colors rounded cursor-pointer"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
            Gerar link de convite
        </button>
        <div className="p-2">
            <EmptyMessage message="Copie o código de convite e envie a seus amigos!" />
        </div>
        </>
    )

}