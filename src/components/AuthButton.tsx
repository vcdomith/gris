'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export default function AuthButton() {

    const { data: session } = useSession()

    return (
        <div>
        {session ? (
            <>
            <p>Welcome {session.user?.name}</p>
            <button onClick={() => signOut()}>Sign out</button>
            </>
        ) : (
            <button 
                className='bg-amber-100 rounded-b-md text-black cursor-pointer'
                onClick={() => signIn("spotify")}
            >Sign in with Spotify</button>
        )}
        </div>
    )

}