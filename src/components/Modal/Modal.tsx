'use client'
import { useRouter } from "next/navigation";
import { MouseEvent, ReactNode, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from 'motion/react'

export default function Modal(
    { children, closeFn }: 
    { children?: ReactNode, closeFn?: () => void }
) {

    const backdropRef = useRef<HTMLElement | null>(null)
    const router = useRouter()

    const [visible, setVisible] = useState(true)

    const handleClick = (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {

        if((e.target as HTMLElement) === backdropRef.current!) {
            if(closeFn) {
                setVisible(false)
                return
            }
            setVisible(false)
            router.back()
        }
        // if (e.target)
        // router.back()

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
        <AnimatePresence onExitComplete={closeFn}>
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
                    <motion.div
                        
                    >
                    {children}
                    </motion.div>
                </div>
            </motion.section>
        </motion.div>
        }
        </AnimatePresence>

    )

}