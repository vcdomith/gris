import Link from "next/link";
import AuthButton from "../AuthButton";
import { TokenSession } from "@/interfaces/Spotify";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import Image from "next/image";
import { dbAdmin } from "@/utils/db/supabase";
import { redirect } from "next/navigation";
import Groovy from "../Groovy/Groovy";

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
        <nav className="fixed top-0 left-0 flex justify-between w-[calc(100%)] bg-amber-50/0 backdrop-blur-lg z-10 px-4 py-2">
            <Link 
                href='/'
                className="flex items-center"
            >
            <div className="flex gap-1 items-center">
                <Groovy />
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
                <div className="flex justify-center items-center w-[35px] h-[35px] rounded-4xl bg-slate-800 select-none overflow-hidden">
                    {user?.spotify_id[0].toUpperCase()}
                </div>
                }
                {/* <h3>{user?.spotify_id}</h3> */}
                {/* <AuthButton /> */}
            </span>
        </nav>
    )

}