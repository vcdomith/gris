'use client'
import { useRouter } from "next/navigation";
import { MouseEvent, ReactNode, useRef, useState } from "react";

export default function Modal({ children }: { children: ReactNode}) {

    const backdropRef = useRef<HTMLElement | null>(null)
    const router = useRouter()

    const handleClick = (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {

        if((e.target as HTMLElement) === backdropRef.current!) {
            router.back()
        }
        // if (e.target)
        // router.back()

    }

    return (
        <div className="flex justify-center items-center fixed top-0 left-0 w-full h-dvh z-998">
            <section 
                ref={backdropRef}
                className="flex justify-center items-center fixed top-0 left-0 w-full h-full bg-neutral-900/50 backdrop-blur-sm z-998 cursor-alias"
                onClick={(e) => handleClick(e)}
            >
                <div className="relative flex items-center justify-center w-fit h-fit z-1000 cursor-default">
                    {children}
                </div>
            </section>
        </div>
    )

}