"use client"

import { signIn, ClientSafeProvider } from "next-auth/react"

type Props = {
  providers: Record<string, ClientSafeProvider>
}

export default function SignInClient({ providers }: Props) {
  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </>
  )
}
