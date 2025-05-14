import { removeTrack } from "@/app/actions/actions"
import ButtonWatcher from "@/components/ButtonWatcher/ButtonWatcher"
import Container from "@/components/Container/Container"
import { DeleteTrackButton } from "@/components/DeleteTrackButton/DeleteTrackButton"
import Track from "@/components/Track/Track"
import { IArtist, SpotifyPlaylistResponse, SpotifyToken } from "@/interfaces/Spotify"
import { authOptions } from "@/utils/authOptions"
import { dbAdmin } from "@/utils/db/supabase"
import { getServerSession } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

type Params = Promise<{ spotifyId: string }>
export default async function Playlist({ params }: { params: Params }) {

    const { spotifyId } = await params

    const session = await getServerSession(authOptions)
    if (!session || !session.token.accessToken || !session.user?.email) {
        redirect(`/api/auth/signin?callbackUrl=/groups/${spotifyId}`)
    }

    console.log(spotifyId);

    const supabase = dbAdmin()

    const { data: playlistBySpotifyId, error: playlistLookupError } = await supabase
        .schema('gris')
        .from('playlists')
        .select('*')
        .eq('spotify_id', spotifyId)
        .single()

    if (!playlistBySpotifyId || playlistLookupError) {
        console.error('Could not find playlist by spotfy_id', playlistLookupError)
        redirect('/')
    }

    const id = playlistBySpotifyId.id

    const { data: userWithMembership, error: userError } = await supabase
        .schema('gris')
        .from('users')
        .select(`
            id,
            email,
            spotify_id,
            playlist_members (
                playlist_id
            )
        `)
        .eq('email', session.user.email)
        .eq('playlist_members.playlist_id', id)
        .single()

    console.log(userWithMembership);
    
    if (userError || !userWithMembership?.id) {
        console.error('Supabase could not fetch user')
        redirect(`/api/auth/signin?callbackUrl=/groups/${id}`)
    }

    const isMember = userWithMembership.playlist_members.length === 1
    if (!isMember) {
        console.error('Usuário não é membro do grupo')
        redirect('/')
    }

    const { data: playlistData, error: playlistError } = await supabase
        .schema('gris')
        .from('playlists')
        .select(`
            *, 
            playlist_members (
                user_id,
                users (
                    id,
                    spotify_id,
                    img_url
                )
            )
        `)
        .eq('id', id)
        .single()

    if (!playlistData || playlistError) {
        console.error('Error fetching groupData from supabase', playlistError)
        redirect('/')
    }


    const { name, spotify_id, playlist_members } = playlistData

    const res = await fetch(`https://api.spotify.com/v1/playlists/${spotify_id}`, {
        headers: {
            'Authorization': `Bearer ${session.token.accessToken}`
        }
    })
    if (!res.ok) {
       console.error('Error fetching playlist from spotify', res) 
    }
    const playlist: SpotifyPlaylistResponse = await res.json()
    console.log(playlist);

    return (
     
        <>
        <ButtonWatcher href={`/playlists/${spotifyId}/modal`} />        
        <div className="flex flex-col gap-4 rounded-lg w-full min-w-[calc(100vw-2rem)] bg-amber-50/10 md:bg-amber-50/20 backdrop-blur-lg p-4 pt-1 overflow-y-hidden md:w-[60dvw] md:min-w-[60dvw] lg:w-[40dvw] lg:min-w-[40dvw]">
           
            <span className="flex gap-2 justify-between items-center w-full pb-1 border-b-2 border-slate-300/30">
            
                <div className="flex gap-0.5 items-center overflow-hidden">
                    <span className="flex gap-0.5 items-center">
                        <Link 
                            href={`/`}
                            prefetch
                            className="text-amber-50/30"
                        >
                            Playlists
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" className="stroke-amber-50/30"/>
                        </svg>
                    </span>
                    <h5 className="truncate">{name}</h5>
                </div>

            </span>

            <Link 
                href={`/playlists/${spotifyId}/modal`}
                id='observed' 
                prefetch
                className="flex justify-center items-center gap-1 w-full rounded-md py-1 bg-slate-300 hover:bg-slate-200 text-slate-800 cursor-pointer active:bg-slate-400 transition-colors"
            >
                <span className="relative w-[20px] h-[20px]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3 stroke-neutral-800 absolute top-[0px] left-[-0.25rem]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 stroke-neutral-800 absolute top-[0px] left-[0px]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
                    </svg>
                </span>
                <p>
                Adicionar música
                </p>
            </Link>

            <div className="">

                <ul className="flex flex-col gap-4 h-full md:bg-neutral-800/40 md:p-4 inset-shadow-sm rounded">
                
                {(playlist.tracks.items && playlist.tracks.items.length > 0)
                ?
                playlist.tracks.items.map(({ added_by, track }) => 
                    <div 
                        key={track.id}
                        className="flex justify-between"
                    >
                        
                        <span 
                            className="flex justify-between w-full"
                        >
                            <Track 
                                img={track.album.images[0].url} 
                                name={track.name} 
                                artist={track.artists.map((a: IArtist) => a.name).join(', ')}
                                size={60}
                                omitPadding
                                author={ 
                                    <Author 
                                        id={added_by.id}
                                        playlist_members={playlist_members}
                                    />
                                }
                            />
                            {(added_by.id === userWithMembership.spotify_id)&&
                            // <button 
                            //     type="submit"
                            //     className="bg-transparent transition-colors cursor-pointer rounded p-0.5"
                            // >
                            // <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 stroke-amber-50/50 group-hover:stroke-amber-50/80 transition-colors">
                            //     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            // </svg>
                            // </button>
                            <DeleteTrackButton 
                                playlistId={spotifyId} 
                                trackUri={track.uri} 
                                snapshotId={playlist.snapshot_id}
                            />
                            }
                        </span>
                        {/* <Author 
                            id={added_by.id}
                            playlist_members={playlist_members}
                        /> */}
                        
                    </div>
                )
                : 
                <div>Nenhuma musica na playlist ainda</div>
                }
                </ul>
            </div>

        </div>
        </>

    )

}

interface PlaylistMember {
    user_id: number;
    users: {
        id: number;
        spotify_id: string;
        img_url: string | null;
    }
}

function Author({ id, playlist_members }: { id: string, playlist_members: PlaylistMember[] }) {

    return (
        <>
        {playlist_members.map( ({ users: user }) => {

            const isAuthor = user.spotify_id === id
            const hasImage = user.img_url && user.img_url !== 'NULL'

            return (
                <span key={user.spotify_id} className="flex gap-1 items-center pt-1">
                {(isAuthor && hasImage)
                ?
                <Image
                    src={user.img_url!}
                    alt={`${user.spotify_id} image`}
                    width={20}
                    height={20}
                    ></Image>
                :
                <div className="flex justify-center items-center w-[20px] h-[20px] rounded-4xl text-xs bg-slate-800 select-none">{user?.spotify_id[0].toUpperCase()}</div>
                }
                <h3 className="text-sm text-amber-50/50">{user.spotify_id}</h3> 
                </ span>
            )

        })
        }
        </>
    )

}