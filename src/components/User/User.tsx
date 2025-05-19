'use client'
import Image from "next/image";
import { SessionUser } from "../Nav/Nav";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { AnimatePresence, motion } from "motion/react";

export default function User({ user }: { user: SessionUser }) {

    const [open, setOpen] = useState(false)

    return (
        <span 
            className="relative flex gap-2 items-center cursor-pointer"
            onClick={() => setOpen(true)}
        >
            {(user.img_url !== 'NULL')
            ?
            <Image
                src={user.img_url!}
                alt={`${user.spotify_id} image`}
                width={35}
                height={35}
            ></Image>
            :
            <div className="flex justify-center items-center w-[35px] h-[35px] rounded-4xl bg-slate-800 select-none overflow-hidden">
                {user?.spotify_id[0].toUpperCase()}
            </div>
            }
            <AnimatePresence>
            {open&&
                <UserExpand 
                    user={user} 
                    setOpen={setOpen}
                />
            }
            </AnimatePresence>
        </span>
    )

}

function UserExpand({ user, setOpen }: { user: SessionUser, setOpen: ( open: boolean ) => void }) {

    const cardRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {

        const controller = new AbortController()

        const handleClick = (e: MouseEvent) => {
            if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
                setOpen(false)
                e.preventDefault()
                e.stopPropagation()
                console.log('clicked outside card');
            }
        }

        document.addEventListener('click', handleClick, { signal: controller.signal })
        
        return () => {
            controller.abort()
        }

    }, [])

    return (
        <motion.div
            ref={cardRef}
            className="flex flex-col gap-2 absolute top-12 right-0 p-2 w-[200px] bg-radial from-slate-900 to-slate-700 border-2 border-amber-500/10 backdrop-blur-lg rounded shadow-2xl cursor-default"

            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <span className="flex gap-1 items-center border-neutral-400/30 pb-2 border-b-2">
                {(user.img_url !== 'NULL')
                ?
                <Image
                    src={user.img_url!}
                    alt={`${user.spotify_id} image`}
                    width={25}
                    height={25}
                ></Image>
                :
                <div className="flex justify-center items-center w-[25px] h-[25px] rounded-4xl bg-slate-800 text-xs/snug">{user.spotify_id[0].toUpperCase()}</div>
                }
                <div className="flex">
                <h3 className="text-amber-50">{user.spotify_id}</h3>
                </div>
            </span>         
            <button
                onClick={() => signOut()}    
                className="flex gap-2 items-center px-0.5 py-0.5 bg-transparent hover:bg-neutral-50/20 transition-colors rounded cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                </svg>
                Log out
            </button>
        </motion.div>
    )

}