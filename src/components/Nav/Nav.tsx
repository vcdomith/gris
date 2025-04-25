import Link from "next/link";
import AuthButton from "../AuthButton";
import { TokenSession } from "@/interfaces/Spotify";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import Image from "next/image";
import { dbAdmin } from "@/utils/db/supabase";
import { redirect } from "next/navigation";

export default async function Nav() {

    const session: TokenSession | null = await getServerSession(authOptions)

    if (!session || !session.user.email) {
        redirect(`/api/auth/signin`)    
    }

    const supabase = dbAdmin()
    const { data: user, error: userError } = await supabase
        .schema('gris')
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single()

    if (userError) {
        console.error('Supabase unable to fetch user', userError)
    }

    return (
        <nav className="fixed top-0 flex justify-between w-dvw bg-amber-50/0 backdrop-blur-lg z-10 px-4 py-2">
            <Link 
                href='/'
                className="flex items-center"
            >
            <div className="flex gap-1 items-center">
                <svg width="35" height="35" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M17 81.5V45C17 26.7746 31.7746 12 50 12C68.2254 12 83 26.7746 83 45V81.5C83 87.5751 78.0751 92.5 72 92.5C65.9249 92.5 61 87.5751 61 81.5C61 87.5751 56.0751 92.5 50 92.5C43.9249 92.5 39 87.5751 39 81.5C39 87.5751 34.0751 92.5 28 92.5C21.9249 92.5 17 87.5751 17 81.5ZM65 38C59.4772 38 55 42.4772 55 48H65H75C75 42.4772 70.5228 38 65 38ZM35 38C29.4772 38 25 42.4772 25 48H45C45 42.4772 40.5228 38 35 38Z" fill="#d9d9d9"/>
                </svg>
                <div className="flex flex-col">
                    <h1 className="text-3xl text-amber-50">Gris</h1>
                    {/* <h3 className="text-sm text-amber-50/90">~ groovy in spirit ~</h3> */}
                </div>
            </div>
            </Link>
            <span className="flex gap-2 items-center">
                {(session && user && (user.img_url !== 'NULL'))
                ?
                <Image
                    src={user.img_url!}
                    alt={`${user.spotify_id} image`}
                    width={35}
                    height={35}
                ></Image>
                :
                <div className="flex justify-center items-center w-[35px] h-[35px] rounded-4xl bg-slate-800 select-none">{user?.spotify_id[0].toUpperCase()}</div>
                }
                {/* <h3>{user?.spotify_id}</h3> */}
                {/* <AuthButton /> */}
            </span>
        </nav>
    )

}