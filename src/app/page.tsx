import AuthButton from "@/components/AuthButton";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
// import Image from "next/image";
import { SpotifyUser } from "@/interfaces/Spotify";

export default async function Home() {

  const session = await getServerSession(authOptions)

  const res = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${session?.token.accessToken}`
    }
  })
  console.log(res);
  const json: SpotifyUser = await res.json()
  // const playlists = json.items
  // console.log(playlists);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <AuthButton />
        {session&&
          JSON.stringify(json)
        }
        {/* {(session && playlists)&&
          playlists.map( playlist => 
            <div key={playlist.id}>
              <Image 
                src={(playlist.images.length > 0) ? playlist.images[0].url : ''} 
                alt={""}
                width={50}
                height={50}
              ></Image>
              <p>{playlist.name}</p>
            </div>
          )
        } */}
      </main>
    </div>
  );
}
