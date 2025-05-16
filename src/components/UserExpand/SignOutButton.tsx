'use client'

import { signOut } from "next-auth/react"


export default function SignOut() {

    return (
        <button
            onClick={() => signOut()}    
            className="border-2 border-amber-50/30 bg-amber-50/10 hover:bg-amber-50/20 transition-colors cursor-pointer"
        >
            Log out
        </button>
    )

}