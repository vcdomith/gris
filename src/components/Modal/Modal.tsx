'use client'
import { useRouter } from "next/navigation";
import React, { MouseEvent, ReactNode, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from 'motion/react'
import { useModal } from "@/app/contexts/ModalContext"


type Sizes = 'small' | 'large'

const SIZE_CLASS: Record<Sizes, string> = {
    small: "flex flex-col gap-4 p-2 pt-1 rounded bg-neutral-500/50 border-2 border-neutral-500/20 backdrop-blur-lg",
    large: "flex flex-col bg-neutral-500/50 backdrop-blur-2xl w-full min-w-full md:w-[60dvw] md:min-w-[60dvw] lg:w-[40dvw] lg:min-w-[40dvw] lg:max-w-[calc(600px-6rem)] h-[80dvh] p-2 pt-1 border-2 border-slate-500/30 rounded-md overflow-hidden"
}

export default function Modal(
    { 
        children, 
        closeFn,
        header = '',
        size = 'large'
    }: 
    { 
        children?: ReactNode, 
        closeFn?: () => void,
        header?: string,
        size?: Sizes
    }
) {

    const backdropRef = useRef<HTMLElement | null>(null)
    const router = useRouter()
    const { loadingState } = useModal()
    const [ loading ] = loadingState

    const [visible, setVisible] = useState(true)

    const handleClick = (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {

        if (loading) return

        if((e.target as HTMLElement) === backdropRef.current!) {
            // if(closeFn) {
            //     setVisible(false)
            //     return
            // }
            setVisible(false)
            // router.back()
        }
        // if (e.target)
        // router.back()

    }

    const exitCompleteHandler = () => {
        if(closeFn) {
            closeFn()
            return
        }
        router.back()
    }

    useEffect(() => {
        
        const controller = new AbortController()

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (closeFn) {
                    setVisible(false);
                } else {
                    setVisible(false)
                    router.back();
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown, { signal: controller.signal })
        
        return () => {
            controller.abort()
        }

    }, [closeFn, router])

    return (
        <AnimatePresence onExitComplete={exitCompleteHandler}>
        {visible&&
        <motion.div 
            className="flex justify-center items-center fixed top-0 left-0 w-full h-dvh z-998"
            exit={{ opacity: 0 }}
        >
            <motion.section 
                ref={backdropRef}
                className="flex justify-center items-center fixed top-0 left-0 w-full h-full bg-neutral-900/50 backdrop-blur-sm transition z-998 cursor-alias"
                onClick={(e) => handleClick(e)}

                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="relative flex items-center justify-center w-fit h-fit z-1000 cursor-default">
                    <div className={SIZE_CLASS[size]}>
                    <ModalHeader header={header} close={() => setVisible(false)} />
                    {children}
                    </div>
                </div>
            </motion.section>
        </motion.div>
        }
        </AnimatePresence>

    )

}


const ModalHeader = ({ header, close }: { header: string, close: () => void }) => {

    if (!header) return null;

    return (
        <span className="flex justify-between border-b-2 border-amber-50/20">
            <h3>{header}</h3>
            <button
                onClick={() => close()}
                className="group cursor-pointer p-0.5"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 stroke-amber-50/50 group-hover:stroke-amber-50/80 transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </span>
    )

}