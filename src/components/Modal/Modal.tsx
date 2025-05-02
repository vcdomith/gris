'use client'
import { useRouter } from "next/navigation";
import React, { MouseEvent, ReactNode, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from 'motion/react'
import { useModal } from "@/app/contexts/ModalContext"
import Container, { Sizes } from "../Container/Container";

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
        
        if (visible) {
            document.body.style.overflow = 'hidden'
        }

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
            document.body.style.overflow = ''
        }

    }, [closeFn, router, visible])

    return (
        <AnimatePresence onExitComplete={exitCompleteHandler}>
        {visible&&
        <motion.div 
            className="flex justify-center items-center fixed top-0 left-0 w-[calc(100dvw] md:w-[calc(100dvw-1rem)] h-dvh z-998 px-2"
            exit={{ opacity: 0 }}
        >
            <motion.section 
                ref={backdropRef}
                className="flex justify-center items-center fixed top-0 left-0 w-[calc(100dvw] md:w-[calc(100dvw)] pr-[1rem] h-dvh bg-neutral-900/50 backdrop-blur-sm transition z-998 cursor-alias"
                onClick={(e) => handleClick(e)}

                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <Container 
                    size={size} 
                    header={
                        <ModalHeader 
                            header={header} 
                            loading={loading}
                            close={() => setVisible(false)}
                        />
                    } 
                >
                    {children}
                </Container>
            </motion.section>
        </motion.div>
        }
        </AnimatePresence>

    )

}


const ModalHeader = ({ header, loading, close }: { header: string, loading: boolean, close: () => void }) => {

    if (!header) return null;

    return (
        <span className="flex justify-between border-b-2 border-amber-50/20">
            <h3>{header}</h3>
            <button
                disabled={loading}
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