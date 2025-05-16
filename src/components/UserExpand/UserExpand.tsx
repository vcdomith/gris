import { authOptions } from "@/utils/authOptions"
import { dbAdmin } from "@/utils/db/supabase"
import { getServerSession } from "next-auth"
import Image from "next/image"
import { redirect } from "next/navigation"
import SignOut from "./SignOutButton"

export default async function UserExpand() {

    const session = await getServerSession(authOptions)
    if(!session || !session.user?.email) {
        redirect(`/api/auth/signin`)
    }

    const supabase = dbAdmin()

    const { data: user, error: userError } = await supabase
        .schema('gris')
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single()

    if(!user || userError) {
        console.error('Error fetching user', userError)
        return null
    }

    return (
        <div>
            <span className="flex gap-1 items-center border-slate-400/30 pt-1">
                {(user.img_url !== 'NULL')
                ?
                <Image
                    src={user.img_url!}
                    alt={`${user.spotify_id} image`}
                    width={25}
                    height={25}
                ></Image>
                :
                <div className="flex justify-center items-center w-[25px] h-[25px] rounded-4xl bg-slate-800 text-xs/snug">{user.spotify_id[0].toUpperCase()}</div>
                }
                <div className="flex">
                <h3 className="text-amber-50">{user.spotify_id}</h3>
                {/* <h5 className="text-xs text-slate-300">{new Date(post.created_at).toLocaleString()}</h5> */}
                </div>
            </span>         
            <SignOut />
        </div>
    )

}