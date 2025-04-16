import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

export const authOptions = {
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID!,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "user-read-email user-read-private user-read-playback-state user-modify-playback-state streaming",
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expiresAt = account.expires_at! * 1000;
            }
            return token
        },
        async session({ session, token }) {
            return {
                ...session,
                token
            }
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }