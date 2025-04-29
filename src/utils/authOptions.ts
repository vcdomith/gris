import { createClient } from './../../node_modules/@supabase/supabase-js/src/index';
import { SpotifyToken } from "@/interfaces/Spotify";
import { Account, AuthOptions, Session, User } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { dbAdmin } from './db/supabase';

const supabaseAdmin = dbAdmin()

const refreshAccessToken = async (token: string): Promise<Partial<SpotifyToken> | null> => {

    try {

        const basic = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')

        const res = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${basic}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: token,
            }),
        })

        const data = await res.json()
        // console.log(data);

        if (!res.ok) throw new Error(data)

            return {
                accessToken: data.access_token,
                expiresAt: Date.now() + data.expires_in * 1000,
                refreshToken: data.refresh_token ?? token,
            }

    } catch (error) {
        console.error("Failed to refresh access token", JSON.stringify(error))
        return null
    }

}

export const authOptions: AuthOptions = {
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
    session: {
        strategy: 'jwt',
    },
    callbacks: {

        async signIn(
            {user, account}: 
            {user: User, account: Account | null}
        ) {
            console.log('signin', user, account);

            if (!account) return false;

            const { email, image } = user
            const { refresh_token, providerAccountId } = account

            if (!email || !refresh_token) return false;

            const { data, error } = await supabaseAdmin
                .schema('gris')
                .from('users')
                .select('refresh_token')
                .eq('email', email)
                .single()

            console.log(data, error);

            if (error && error.code !== 'PGRST116'){
                console.error('Supabase fetch error:', error)
                return false;
            }    

            if (!data) {
                // Usuário não existe na tabela -> inserir 
                // console.log('no data exists');
            
                const { error: insertError } = await supabaseAdmin
                    .schema('gris')
                    .from('users')
                    .insert({
                        email,
                        spotify_id: providerAccountId,
                        refresh_token,
                        image
                    })

                // console.log(insertData, insertError);

                if (insertError) {
                    console.error('Supabase insert error:', insertError)
                    return false;
                }

            } else if (data.refresh_token !== refresh_token) {
                console.log('signin, token is diff and update');
                // Refresh token mudou -> atualizar
                const { error: updateError } = await supabaseAdmin
                    .schema('gris')
                    .from('users')
                    .update({ refresh_token })
                    .eq('email', email)

                if (updateError) {
                    console.error('Supabase update error:', updateError)
                    return false
                }

            }

            return true
        },
        async jwt({
                token, 
                account,
            }: { 
                token: SpotifyToken, 
                account: Account | null
                session?: Session
            }): Promise<SpotifyToken> {

            // console.log(token, account);

            if (account) {
                token.accessToken = account.access_token!;
                token.providerAccountId = account.providerAccountId!;
                token.refreshToken = account.refresh_token!;
                token.expiresAt = Date.now() + parseInt(account.expires_in as string)! * 1000;

                if (!account.expires_in) {
                    console.warn('Missing account.expires_in:', account);
                }

                // console.log(token, account);    
                // console.log('account ok');
                return token as SpotifyToken
            }

            
            // console.log('token', token);
            if (Date.now() < token.expiresAt) {
                return token
            }

            let refreshToken = token.refreshToken;

            if (!refreshToken) {

                const { data, error } = await supabaseAdmin
                    .schema('gris')
                    .from('users')
                    .select('refresh_token')
                    .eq('spotify_id', token!.providerAccountId!)
                    .single()

                if (error || !data?.refresh_token) {
                    console.error('Could not find refresh token in database:', error)
                    return token;
                }

                refreshToken = data.refresh_token;
            }

            // console.log(token, account);
            // console.log('token', token);

            const refreshed =  await refreshAccessToken(refreshToken)
            if (!refreshed) {
                return {...token, error: 'RefreshAccessTokenError'}
            }

            if (refreshed.refreshToken && refreshed.refreshToken !== token.refresh_token) {

                token.refreshToken = refreshed.refreshToken;

                console.log('jwt, token is diff and update');
                const { error: updateError } = await supabaseAdmin
                    .schema('gris')
                    .from('users')
                    .update({ 
                        refresh_token: refreshed.refreshToken ,
                        updated_at: new Date().toISOString()
                    })
                    .eq('spotify_id', token.providerAccountId)

                if (updateError) {
                    console.error('Supabase update refresh_token error', updateError)
                }
            }

            // return {...token, ...refreshed} as SpotifyToken
            const result = {
                ...token,
                accessToken: refreshed.accessToken,
                expiresAt: refreshed.expiresAt,
                refreshToken: refreshed.refreshToken,
            }
            // console.log('result', result);
            return result as SpotifyToken

        },
        async session({ 
            session, 
            token 
        }: {
            session: Session,
            token: SpotifyToken,
        }): Promise<Session> {
            return {
                ...session,
                token
            }
        }
    }
}