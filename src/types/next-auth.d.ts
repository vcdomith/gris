import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    token: {
      accessToken: string
      refreshToken: string
      expiresAt: number
      error?: string
    }
  }

  interface JWT {
    accessToken: string
    refreshToken: string
    providerAccountId: string
    expiresAt: number
    error?: string
  }
}

declare module "next-auth/jwt" {
    interface JWT {
      accessToken: string
      refreshToken: string
      providerAccountId: string
      expiresAt: number
    }
  }
