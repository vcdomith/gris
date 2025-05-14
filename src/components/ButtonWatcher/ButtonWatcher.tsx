'use client'

import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function ButtonWatcher({ href }: { href: string }) {

    const [visible, setVisible] = useState(true)

    useEffect(() => {

        const target = document.getElementById('observed')
        if(!target) return

        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0.1 }
        )

        observer.observe(target)
        return () => observer.disconnect()

    }, [])
    // md:w-[60dvw] lg:w-[40dvw]
    return (
        <AnimatePresence>
        {!visible&&
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 md:left-[calc(80dvw+1rem)] lg:left-[calc(70dvw+1rem)] z-10"
        >
        <Link 
            prefetch
            href={href}
            className={`relative flex justify-center items-center w-15 h-15 md:w-12 md:h-12 rounded-full bg-slate-300 hover:bg-slate-200 active:bg-slate-400 inset-shadow-sm transition-colors shadow-2xl`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5 md:size-4 stroke-neutral-800 absolute top-[1rem] left-[0.4rem] md:top-3 md:left-1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 md:size-6 stroke-neutral-800 absolute top-[16px] left-[1.1rem] md:top-[12px] md:left-[0.9rem]">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
            </svg>
        </Link>
        </motion.div>
        }
        </AnimatePresence>
    )

}