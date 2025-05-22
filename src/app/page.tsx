import { getServerSession } from "next-auth";
// import Image from "next/image";
import { SpotifyUser, TokenSession } from "@/interfaces/Spotify";
import { redirect } from "next/navigation";
import { authOptions } from "@/utils/authOptions";
import AuthButton from "@/components/AuthButton";
import GradientComponent from "@/components/Gradient/Gradient";
import { dbAdmin } from "@/utils/db/supabase";
import Link from "next/link";
import EmptyMessage from "@/components/EmptyMessage/EmptyMessage";
import Modal from "@/components/Modal/Modal";
import GroupBanner from "@/components/Banners/Banners";
import Groovy from "@/components/Groovy/Groovy";
import Banners from "@/components/Banners/Banners";


export default async function Home() {

  const session: TokenSession | null = await getServerSession(authOptions)

  console.log(session);

  if (!session) {
      redirect(`/api/auth/signin`)
  }

  const supabase = dbAdmin()

  const { data: groups, error: groupsError } = await supabase
    .schema('gris')
    .rpc('get_groups', {
      spotify_id: session.token.sub as string
  })

  if (groupsError) {
    console.error('Supabase groups query error', groupsError)
  }

  const { data: playlists, error: playlistsError } = await supabase
    .schema('gris')
    .from('playlists')
    .select(`
      *,
      users (*)
      `)
    .eq('users.spotify_id', session.token.sub as string)

  // const { data: playlists, error: playlistsError } = await supabase
  //   .schema('gris')
  //   .rpc('get_playlists', {
  //     spotify_id: session.token.sub as string
  // })

  if (playlistsError) {
    console.error('Supabase playlists query error', playlistsError)
  }

  console.log('Home rendered at', new Date().toISOString());

  // console.log('groups', groups);

  // const res = await fetch('https://api.spotify.com/v1/me', {
  //   headers: {
  //     Authorization: `Bearer ${session?.token.accessToken}`
  //   }
  // })
  // console.log(res);
  // const json: SpotifyUser = await res.json()
  // const playlists = json.items
  // console.log(playlists);

  return (
      <>
        <div className="flex flex-col gap-2 w-full min-w-[calc(100vw-2rem)] md:w-[60dvw] md:min-w-[60dvw] lg:w-[40dvw] lg:min-w-[40dvw] bg-amber-50/20 backdrop-blur-lg p-2 rounded">

          {/* <GroupBanner /> */}
          {Banners.group}

          <span className="flex justify-between border-b-1 border-b-amber-50/50 pb-1">
              <h3>Grupos</h3>
              <Link 
                href={'create/group'}
                prefetch
              >
                <button className="cursor-pointer hover:bg-amber-50/20 transition-colors px-1 rounded-md">+ Criar</button>
              </Link>
          </span>

          <div className="flex flex-col gap-2 mb-4">
          
            {(groups && groups?.length > 0)
            ?
            groups?.map(group => 
              // Object.entries(group).map(([key, value]) =>
              //   <div 
              //     key={key}
              //     className="flex gap-2"
              //   >
              //     <h2 className="text-sm text-amber-50/80">{key}:</h2>
              //     <h3 className="text-md text-amber-50">{value}</h3>
              //   </div>
              // )
              <Link 
                key={group.id}
                href={`/groups/${group.id}`}
                prefetch
                className="flex gap-2 items-center transition-colors hover:bg-amber-50/20 px-2 py-1 rounded-sm"
              >
                {/* <h4>[ {group.id} ]</h4> */}
                {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg> */}
                <Groovy size={25} />

                <h2>{group.name}</h2>
              </Link>
            )
            :
            <div className="p-4">
              <EmptyMessage message="Você não é membro de nenhum grupo crie um ou peça um convite!" />
            </div>
            }
          </div>  

          {Banners.playlist}

          <span className="flex justify-between border-b-1 border-b-amber-50/50 pb-1">
              <h3>Playlists</h3>
              <Link 
                href={'create/playlist'}
                prefetch
              >
                <button className="cursor-pointer hover:bg-amber-50/20 transition-colors px-1 rounded-md">+ Criar</button>
              </Link>
          </span>

          <div className="flex flex-col gap-2">
            {(playlists && playlists?.length > 0)
              ?
              playlists?.map(playlist => 
                <Link 
                  key={playlist.id}
                  href={`/playlists/${playlist.spotify_id}`}
                  prefetch
                  className="flex gap-2 items-center transition-colors hover:bg-amber-50/20 px-2 py-1 rounded-sm"
                >
                  {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg> */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
                  </svg>


                  <h2>{playlist.name}</h2>
                </Link>
              )
              :
              <div className="p-4">
                <EmptyMessage message="Você não é membro de nenhuma playlist crie uma ou peça um convite!" />
              </div>
              }
          </div>  

        </div>

        

      </>
  );
}
