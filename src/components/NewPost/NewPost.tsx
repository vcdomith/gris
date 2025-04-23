'use client'
import useDebounce from "@/hooks/useDebounce"
import useSpotifySeach from "@/hooks/useSpotifySearch"
import { Artist, PaginatedResponse, Track } from "@/interfaces/Spotify"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useState } from "react"

interface TrackState {
    name: string
    artist: string
    album: string
    img_url: string
    uri: string
}

const DEFAULT_TRACK: TrackState = {
    name: "",
    artist: "",
    album: "",
    img_url: "",
    uri: ""
}

export default function NewPost() {

    const [search, setSearch] = useState('')
    const debounced = useDebounce(search, 500)

    const [selectedTrack, setSelectedTrack] = useState<TrackState>(DEFAULT_TRACK)

    const { data: session } = useSession()
    // console.log('session', session);
    const accessToken = session?.token.accessToken
    const { data, isLoading, isError } = useSpotifySeach(debounced, accessToken)

    if (isError) {
        return <div>Error</div>
    }

    return (
        <div 
            className="flex flex-col bg-neutral-500/50 backdrop-blur-2xl w-[calc(80vw-6rem)] max-w-[calc(600px-6rem)] h-[80dvh] p-2 pt-1 border-2 border-slate-500/30 rounded-md"
        >
            <form 
                action=""
                className="flex flex-col gap-4"
                onSubmit={(e) => e.preventDefault()}
            >

                <span className="border-b-2 border-amber-50/50">
                    {/* icone */}
                    <h2>Adicionar música ao feed</h2>
                </span>

                <input 
                    type="text" 
                    placeholder="Buscar música"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-1 border-amber-50/50 focus:border-amber-50/70 transition-colors focus:outline-none px-2 py-1 rounded-sm"
                />

                {(isLoading)
                ?
                <div>Loading...</div>
                :
                data?.tracks?.items?.map((track: Track) => (
                    <span key={track.id} className=" flex gap-2 items-center p-2 border rounded shadow-sm">
                        <Image 
                            src={track.album.images[0].url} 
                            alt='track image'
                            width={45}
                            height={45}
                            className="h-[45px] w-[45px]"
                        ></Image>
                        <div className="flex flex-col">
                            <p className="font-bold">{track.name}</p>
                            <p className="text-sm text-gray-500">{track.artists.map((a: Artist) => a.name).join(', ')}</p>
                        </div>
                    </span>
                ))
                }

                <span className=" flex gap-2 items-center p-2 border rounded shadow-sm">
                    {(selectedTrack.img_url !== '')
                    ?
                    <Image 
                        src={selectedTrack.img_url}
                        placeholder="blur"
                        blurDataURL=""
                        alt='track image'
                        width={45}
                        height={45}
                        className="h-[45px] w-[45px]"
                    ></Image>
                    :
                    <div 
                        className="h-[45px] w-[45px] bg-neutral-500/50"
                    ></div>
                    }
                    
                    <div className="flex flex-col">
                        <p className="font-bold">{selectedTrack.name || 'No track selected'}</p>
                        <p className="text-sm text-gray-500">{selectedTrack.artist || 'No track seleted'}</p>
                    </div>
                </span>

                <button>Adicionar Post</button>

            </form>
        </div>
    )

}