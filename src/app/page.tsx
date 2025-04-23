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
        <div className="flex gap-2 items-center">
        <h1 className="text-5xl text-amber-50">Gris</h1>
        <h3 className="text-md text-amber-50/90">- groovy in spirit -</h3>
        </div>

        <div className="flex flex-col gap-2">

          <span className="flex justify-between border-b-1 border-b-amber-50/50">
              <h3>Grupos</h3>
              <Link 
                href={'/groups/new'}
                prefetch
              >
                <button className="cursor-pointer hover:bg-amber-50/20 transition-colors px-1 rounded-md">+ criar grupo</button>
              </Link>
          </span>

          <div>
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
                className="flex gap-2 transition-colors hover:bg-amber-50/20 px-2 py-1 rounded-sm"
              >
                <h4>[ {group.id} ]</h4>
                <h2>{group.name}</h2>
              </Link>
            )}
          </div>  

        </div>

      </>
  );
}
