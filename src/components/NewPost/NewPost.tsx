'use client'
import { createPost } from "@/app/actions/actions"
import useDebounce from "@/hooks/useDebounce"
import useSpotifySeach from "@/hooks/useSpotifySearch"
import { IArtist, PaginatedResponse, ITrack } from "@/interfaces/Spotify"
import { motion, AnimatePresence, LayoutGroup } from "motion/react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { FormEvent, Ref, useState } from "react"

export interface Post {
    name: string
    artist: string
    album: string
    img_url: string
    uri: string
    spotify_id: string
    message: string
}

const DEFAULT_TRACK: Post = {
    name: "",
    artist: "",
    album: "",
    img_url: "",
    uri: "",
    spotify_id: "",
    message: "",
}

export default function NewPost() {

    const [search, setSearch] = useState('')
    const [debounced, setDebounced] = useDebounce(search, 500)

    const [submitting, setSubmitting] = useState(false)

    const [selectedTrack, setSelectedTrack] = useState<Post>(DEFAULT_TRACK)

    const { data: session } = useSession()
    const group_id = usePathname().split('/')[2]
    const router = useRouter()

    const accessToken = session?.token.accessToken
    const { data, isLoading, isError } = useSpotifySeach(debounced, accessToken)

    if (isError) {
        return <div>Error</div>
    }

    const valid = Object.entries(selectedTrack).every( ([key, value]) => {
        if (key !== 'message') {
            return value !== ''
        } 
        return true
    } )

    const handleSubmit = async (e: FormEvent) => {
        setSubmitting(true)
        e.preventDefault()
        if (!session?.user?.email) {
            console.error('User is not defined')
            setSubmitting(false)
            return 
        }
        await createPost(selectedTrack, session.user.email, group_id)
        setSubmitting(false)
        router.back()
    }

    const handleTrackClick = (track: ITrack) => {
        setDebounced('')
        setSearch('')
        setSelectedTrack( prev => ({
            ...prev,
            name: track.name,
            artist: track.artists.map((a: IArtist) => a.name).join(', '),
            album: track.album.name,
            img_url: track.album.images[0].url,
            spotify_id: track.id,
            uri: track.uri,
        }))
    }

    return (
        <div 
            className="flex flex-col bg-neutral-500/50 backdrop-blur-2xl w-full min-w-full md:w-[60dvw] md:min-w-[60dvw] lg:w-[40dvw] lg:min-w-[40dvw] lg:max-w-[calc(600px-6rem)] h-[80dvh] p-2 pt-1 border-2 border-slate-500/30 rounded-md overflow-hidden"
        >
            <form 
                action=""
                className="flex flex-col gap-4 h-full"
                onSubmit={(e) => handleSubmit(e)}
            >

                <span className="border-b-2 border-amber-50/50">
                    {/* icone */}
                    <h2>Adicionar música ao feed</h2>
                </span>

                <span className="relative flex gap-2 w-full items-center border-amber-50/10 focus-within:border-amber-50/20 transition-colors focus:outline-none bg-amber-50/10 text-neutral-200 placeholder:text-neutral-400 px-2 py-1 rounded-sm">

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>

                    <input 
                        type="text" 
                        placeholder="Buscar música"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full focus:outline-none"
                    />

                    {/* Right icon logic, only when the search text is active and depends if it's loading or not */}
                    {(debounced !== '') && (
                    isLoading
                    ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`absolute right-[0.5rem] size-5 animate-spin`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
                        </svg>
                    ) : (
                        <button 
                            onClick={(e) => {
                                e.preventDefault()
                                setDebounced('')
                                setSearch('')
                            }}
                            className="absolute group right-[0.5rem] group bg-transparent transition-colors cursor-pointer rounded p-0.5"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 stroke-amber-50/50 group-hover:stroke-amber-50/80 transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                        </button>
                    )
                    )}

                    <AnimatePresence>
                    {(debounced)&&
                        <SearchResults 
                        tracks={data?.tracks.items}
                        handleTrackClick={handleTrackClick}
                        loading={isLoading}
                        />
                    }
                    </AnimatePresence>

                </span>


                {/* {(isLoading)
                ?
                <div>Loading...</div>
                :
                data?.tracks?.items?.map((track: ITrack) => (
                    <span 
                        key={track.id} 
                        onClick={() => handleTrackClick(track)}
                        className=" flex gap-2 items-center p-2 border-2 border-amber-50/10 bg-amber-50/5 hover:bg-amber-50/10 cursor-pointer transition-colors rounded shadow-sm"
                    >
                        <Image 
                            src={track.album.images[0].url} 
                            alt='track image'
                            width={45}
                            height={45}
                            className="h-[45px] w-[45px] rounded"
                        ></Image>
                        <div className="flex flex-col">
                            <p className="font-bold">{track.name}</p>
                            <p className="text-sm text-neutral-400">{track.artists.map((a: IArtist) => a.name).join(', ')}</p>
                        </div>
                    </span>
                ))
                } */}

                <div className="flex flex-col gap-2">
                    <span>
                        <h3>Música selecionada:</h3>
                    </span>
                    <span className=" flex gap-2 items-center p-2 border-2 border-amber-50/30 rounded shadow-sm">
                        {(selectedTrack.img_url !== '')
                        ?
                        <Image 
                            src={selectedTrack.img_url}
                            alt='track image'
                            width={45}
                            height={45}
                            className="h-[45px] w-[45px] rounded"
                        ></Image>
                        :
                        <div 
                            className="h-[45px] w-[45px] min-w-[45px] bg-neutral-500/50 rounded"
                        ></div>
                        }
                        
                        <div className="flex flex-col w-full">
                            {(selectedTrack.name !== '')
                            ?
                            <p className="font-bold">{selectedTrack.name}</p>
                            :
                            <div className="h-[1rem] w-[70%] rounded-sm bg-neutral-500/50"></div>
                            }
                            {(selectedTrack.artist !== '')
                            ?
                            <p className="text-sm text-neutral-400">{selectedTrack.artist}</p>
                            :
                            <div className="h-[1rem] w-[50%] rounded-sm mt-2 bg-neutral-500/30"></div>
                            }
                        </div>

                        {valid&&
                        <button 
                            onClick={() => setSelectedTrack(DEFAULT_TRACK)}
                            className="group bg-transparent transition-colors cursor-pointer rounded p-0.5"
                        >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={1.5} 
                            stroke="currentColor" 
                            className="size-6 stroke-amber-50/50 group-hover:stroke-amber-50/70 transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                        </button>
                        }
                    </span>

                    <textarea 
                        name="" 
                        id="" 
                        value={selectedTrack.message}
                        onChange={(e) => setSelectedTrack( prev => ({
                            ...prev,
                            message: e.target.value,
                        }))}
                        placeholder="Mensagem (opcional)"
                        className="border-2 border-amber-50/30 rounded resize-none px-2 py-1 focus:outline-none"
                    ></textarea>
                </div>
                
                {submitting}
                <button
                    className={`flex gap-2 justify-center items-center mt-auto border-2 border-amber-50/20 rounded bg-amber-50/20
                    hover:bg-amber-50/30 transition-colors cursor-pointer disabled:text-amber-50/20 disabled:cursor-default disabled:bg-transparent disabled:border-amber-50/15 ${submitting ? 'animate-pulse' : ''}`}
                    disabled={submitting ? true : !valid}
                >
                    {submitting
                    ? 
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-5 animate-spin`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" 
                        />
                        </svg>
                        Adicionando...
                    </>
                    : 'Adicionar Post'
                    }
                </button>

            </form>
        </div>
    )

}

function SearchResults({
    tracks,
    handleTrackClick,
    loading
}: {
     tracks: ITrack[] | undefined, 
     handleTrackClick: (track: ITrack) => void,
     loading: boolean,
}) {

    return (
        <motion.span 
            className="absolute top-[calc(32px+1rem)] left-0 w-full flex flex-col gap-2 border-2 border-neutral-200/20 bg-neutral-600 p-2 rounded shadow-2xl overflow-hidden"

            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, stagger: 0.1 }}
        >
            <AnimatePresence mode="popLayout">
            {!loading
            ?
            tracks?.map( track => 
                <motion.span 
                    key={track.id} 
                    onClick={() => handleTrackClick(track)}
                    className=" flex gap-2 items-center p-2 border-2 border-amber-50/10 bg-amber-50/5 hover:bg-amber-50/10 cursor-pointer transition-colors rounded shadow-sm"

                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}

                >
                    {(track.album.images[0].url)
                    ?
                    <Image 
                        src={track.album.images[0].url} 
                        alt='track image'
                        width={45}
                        height={45}
                        className="h-[45px] w-[45px] rounded"
                    ></Image>
                    :
                    <div 
                        className="h-[45px] w-[45px] min-w-[45px] bg-neutral-500/50 rounded"
                    ></div>
                    }
                    
                    <div className="flex flex-col">
                        <p className="font-bold">{track.name}</p>
                        <p className="text-sm text-neutral-400">{track.artists.map((a: IArtist) => a.name).join(', ')}</p>
                    </div>
                </motion.span>
                )
                :
                Array.from({ length: 5 }).map((_, i) => (
                    // <Skeleton key={i}/>
                    <motion.span
                        key={i} 
                        className="flex gap-2 items-center p-2 border-2 border-amber-50/10 bg-amber-50/5 rounded shadow-sm overflow-hidden"

                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        
                        <div 
                            className="h-[45px] w-[45px] min-w-[45px] bg-neutral-500/50 rounded"
                        ></div>

                        
                        <div className="flex flex-col w-full">
                            
                            <div className="h-[1rem] w-[70%] rounded-sm bg-neutral-500/50 animate-pulse"></div>
                            
                            <div className="h-[1rem] w-[50%] rounded-sm mt-2 bg-neutral-500/30 animate-pulse"></div>
                            
                        </div>

                    </motion.span>
                ))
            }
            </AnimatePresence>

        </motion.span>
    )

}

function Skeleton() {
    return (
        <motion.span 
            className="flex gap-2 items-center p-2 border-2 border-amber-50/10 bg-amber-50/5 rounded shadow-sm overflow-hidden"

            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            
            <div 
                className="h-[45px] w-[45px] min-w-[45px] bg-neutral-500/50 rounded"
            ></div>

            
            <div className="flex flex-col w-full">
                
                <div className="h-[1rem] w-[70%] rounded-sm bg-neutral-500/50 animate-pulse"></div>
                
                <div className="h-[1rem] w-[50%] rounded-sm mt-2 bg-neutral-500/30 animate-pulse"></div>
                
            </div>

        </motion.span>
    )
}