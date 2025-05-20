'use server'
import { Post } from '@/components/NewPost/NewPost'
import { SpotifyPlaylistResponse, SpotifyToken } from '@/interfaces/Spotify'
import { authOptions } from '@/utils/authOptions'
import { dbAdmin } from '@/utils/db/supabase'
import crypto from 'crypto'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const supabase = dbAdmin()

export async function createElement(formData: FormData) {

    const inviteToken = crypto.randomBytes(32).toString('hex')

    const rawFormData = {
        name: formData.get('name') as string,
        created_by: formData.get('email') as string,
        invite_token: inviteToken,
        element: formData.get('element') as 'group' | 'playlist'
    }

    const { data: user, error: userError } = await supabase
        .schema('gris')
        .from('users')
        .select('id')
        .eq('email', rawFormData.created_by)
        .single()
    if (!user || userError) {
        throw new Error(userError?.message ?? 'Failed to fetch user')
    }
    const { created_by, element, ...data } = rawFormData
    const table = element + 's' as 'groups' | 'playlists'

    const { data: elementData, error: groupError } = await supabase
        .schema('gris')
        .from(table)
        .insert({
            ...data,
            created_by: user.id
        })
        .select()

    console.log(elementData, groupError);

    if (groupError || !elementData?.[0] ) {
        throw new Error(groupError?.message ?? 'Failed to create group')
    }

    const elementId = elementData[0].id
    const userId = user.id

    type MemberElement =
    | { user_id: number; group_id: number; playlist_id?: never }
    | { user_id: number; playlist_id: number; group_id?: never };
      
    let member_element: MemberElement
    if (element === 'group') {
        member_element = { group_id: elementId, user_id: userId}
    } else {
        member_element = { playlist_id: elementId, user_id: userId}
    }

    const { error: memberError } = await supabase
        .schema('gris')
        .from(`${element}_members`)
        .insert(member_element)

    if (memberError) {
        throw new Error(memberError?.message ?? 'Failed to create member in group')
    }

    console.log(rawFormData);

    revalidatePath(`/`)

}

export async function createPlaylist( formData: FormData ) {

    const session = await getServerSession(authOptions)
    if (!session || !session.token.accessToken || !session.user?.email || !(session.token as SpotifyToken).sub ) throw new Error('Not authenticated')

    const inviteToken = crypto.randomBytes(32).toString('hex')

    const rawFormData = {
        name: formData.get('name') as string,
        description: formData.get('desc') as string,
        invite_token: inviteToken,
    }

    const res = await fetch(`https://api.spotify.com/v1/users/${(session.token as SpotifyToken).sub}/playlists`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${session.token.accessToken}`,
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
            name: rawFormData.name,
            description: rawFormData.description,
            public: false,
            collaborative: true,
        })
    })
    console.log(res);
    if (!res.ok) throw new Error('Failed to create new playlist on Spotify')

    const spotifyData: SpotifyPlaylistResponse = await res.json()
    console.log(spotifyData);

    const { data: user, error: userError } = await supabase
        .schema('gris')
        .from('users')
        .select('id')
        .eq('email', session.user?.email)
        .single()
    if (!user || userError) {
        throw new Error(userError?.message ?? 'Failed to fetch user')
    }

    const { data: playlist, error: playlistError } = await supabase
        .schema('gris')
        .from('playlists')
        .insert({
            name: rawFormData.name,
            created_by: user.id,
            invite_token: rawFormData.invite_token,
            spotify_id: spotifyData.id
        })
        .select()
        .single()

    if (playlistError) {
        throw new Error(playlistError?.message ?? 'Failed to create playlist')
    }

    const { error: memberError } = await supabase
        .schema('gris')
        .from(`playlist_members`)
        .insert({
            playlist_id: playlist.id,
            user_id: user.id
        })
    if (memberError) {
        throw new Error(memberError?.message ?? 'Failed to create playlist')
    }

    // return spotifyData
    revalidatePath('/')

}

export async function addToPlaylist(playlistId: string, trackUri: string) {

    const session = await getServerSession(authOptions)
    if (!session || !session.token.accessToken || !session.user?.email || !(session.token as SpotifyToken).sub ) throw new Error('Not authenticated')

    const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${session.token.accessToken}`,
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
            uris: [
                trackUri
            ]
        })
    })
    
    console.log(res);
    if (!res.ok) throw new Error('Failed to add song to playlist on Spotify')

    const spotifyData: SpotifyPlaylistResponse = await res.json()
    console.log(spotifyData);

    revalidatePath(`/playlists/`)

} 

export async function followPlaylist(playlistId: string) {

    const session = await getServerSession(authOptions)
    if (!session || !session.token.accessToken || !session.user?.email || !(session.token as SpotifyToken).sub ) throw new Error('Not authenticated')

    const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${session.token.accessToken}`,
            'Content-Type': 'application/json', 
        }
    })

    console.log(res);
    if (!res.ok) throw new Error('Failed to follow playlist')
    
    return
}

export async function removeTrack(playlistId: string, trackUri: string, snapshotId: string) {

    const session = await getServerSession(authOptions)
    if (!session || !session.token.accessToken || !session.user?.email || !(session.token as SpotifyToken).sub ) throw new Error('Not authenticated')

    const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${session.token.accessToken}`,
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
            tracks: [
                {
                    uri: trackUri
                }
            ],
            snapshotId: snapshotId
        })
    })    

    console.log(res);
    if (!res.ok) throw new Error('Failed to remove song to playlist on Spotify')

    revalidatePath(`/playlists/${playlistId}`)

}

export async function createPost(newTrack: Post, email: string, group_id: string) {

    const valid = Object.entries(newTrack).every( ([key, value]) => {
        if (key !== 'message') {
            return value !== ''
        } 
        return true
    } )

    if (!valid) {
        throw new Error('Empty track is not valid')
    }

    const { message, ...trackRest } = newTrack

    const { data: user, error: userError } = await supabase
        .schema('gris')
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

    if (userError || !user.id ) {
        throw new Error(userError?.message ?? 'Failed to fetch user id')
    }

    const { data: track, error: trackError } = await supabase
        .schema('gris')
        .from('tracks')
        .upsert(trackRest, { onConflict: 'spotify_id' })
        .select()
        .single()

    if (trackError || !track?.id ) {
        throw new Error(trackError?.message ?? 'Failed to insert track')
    }

    const { error: postError } = await supabase
        .schema('gris')
        .from('posts')
        .insert({
            track_id: track.id,
            user_id: user?.id,
            group_id: parseInt(group_id),
            message: message,
        })

    if (postError) {
        throw new Error(postError?.message ?? 'Failed to insert post')
    }
    revalidatePath(`/groups/${group_id}`)

}

export async function enterGroup(formData: FormData) {

    const rawFormData = {
        group_id: formData.get('group_id') as string,
        user_id: formData.get('user_id') as string,
    }

    console.log(rawFormData);

    const { error: membersError } = await supabase
        .schema('gris')
        .from('group_members')
        .insert({
            group_id: parseInt(rawFormData.group_id),
            user_id: parseInt(rawFormData.user_id),
        })

    if (membersError) {
        throw new Error(membersError?.message ?? 'Failed to insert member into group')
    }

    redirect('/')

}