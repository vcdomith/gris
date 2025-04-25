import { getServerSession } from "next-auth";
// import Image from "next/image";
import { SpotifyUser, TokenSession } from "@/interfaces/Spotify";
import { redirect } from "next/navigation";
import { authOptions } from "@/utils/authOptions";
import AuthButton from "@/components/AuthButton";
import GradientComponent from "@/components/Gradient/Gradient";
import { dbAdmin } from "@/utils/db/supabase";
import Link from "next/link";


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
        {/* <div className="flex gap-2 items-center">
        <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M17 81.5V45C17 26.7746 31.7746 12 50 12C68.2254 12 83 26.7746 83 45V81.5C83 87.5751 78.0751 92.5 72 92.5C65.9249 92.5 61 87.5751 61 81.5C61 87.5751 56.0751 92.5 50 92.5C43.9249 92.5 39 87.5751 39 81.5C39 87.5751 34.0751 92.5 28 92.5C21.9249 92.5 17 87.5751 17 81.5ZM65 38C59.4772 38 55 42.4772 55 48H65H75C75 42.4772 70.5228 38 65 38ZM35 38C29.4772 38 25 42.4772 25 48H45C45 42.4772 40.5228 38 35 38Z" fill="#d9d9d9bc"/>
        </svg>
        <h1 className="text-5xl text-amber-50">Gris</h1>
        <h3 className="text-md text-amber-50/90">- groovy in spirit -</h3>
        </div> */}

        <div className="flex flex-col gap-2 w-[40vw] bg-amber-50/20 backdrop-blur-lg p-2 rounded">

          <span className="flex justify-between border-b-1 border-b-amber-50/50 pb-1">
              <h3>Grupos</h3>
              <Link 
                href={'/groups/new'}
                prefetch
              >
                <button className="cursor-pointer hover:bg-amber-50/20 transition-colors px-1 rounded-md">+ Criar</button>
              </Link>
          </span>

          <div className="flex flex-col gap-2">
          
            {groups?.map(group => 
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>

                <h2>{group.name}</h2>
              </Link>
            )}
          </div>  

          <span className="flex justify-between border-b-1 border-b-amber-50/50 pb-1">
              <h3>Playlists</h3>
              <Link 
                href={'/groups/new'}
                prefetch
              >
                <button className="cursor-pointer hover:bg-amber-50/20 transition-colors px-1 rounded-md">+ Criar</button>
              </Link>
          </span>

          <div className="flex flex-col gap-2">
            {groups?.map(group => 
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>


                <h2>{group.name}</h2>
              </Link>
            )}
          </div>  

        </div>

        

      </>
  );
}
