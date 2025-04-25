import GradientComponent from "@/components/Gradient/Gradient";
import Track from "@/components/Track/Track";
import { ITrack } from "@/interfaces/Spotify";
import { authOptions } from "@/utils/authOptions";
import { dbAdmin } from "@/utils/db/supabase";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import style from './groups.module.css'

interface PostDB {
    created_at: string;
    group_id: number;
    id: number;
    message: string | null;
    track_id: number;
    user_id: number;
    tracks: {
        id: number;
        name: string;
        artist: string;
        album: string;
        uri: string;
        img_url: string;
    };
    users: {
        id: number
        spotify_id: string
        img_url: string | null
    }
}

type Params = Promise<{ id: number }>
export default async function Group(
    { params, modal }: { params: Params, modal: ReactNode }
) {

    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || !session?.user?.email) {
        redirect(`/api/auth/signin?callbackUrl=/groups/${id}`)
    }

    const supabase = dbAdmin()

    const { data: user, error: userError } = await supabase
        .schema('gris')
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single()

    if (userError || !user.id) {
        console.error('Supabase could not fetch user')
        redirect(`/api/auth/signin?callbackUrl=/groups/${id}`)
    }

    const { error: memberError } = await supabase
        .schema('gris')
        .from('group_members')
        .select('*')
        .eq('group_id', id)
        .eq('user_id', user.id)

    if (memberError) {
        console.error('User is not a member of this group')
        redirect('/')
    }

    const { data: posts, error: postsError } = await supabase
        .schema('gris')
        .from('posts')
        .select(`
            *,
            tracks:track_id (
            id,
            name,
            artist,
            album,
            uri,
            img_url
            ),
            users:user_id (
            id,
            spotify_id,
            img_url
            )
        `)
        .eq('group_id', id)
    // Using a remote procedure call, a postgres function that first checks if the user belongs to the curent group, if it does then queries the posts of this groups descending
    // const { data: posts, error: postsError } = await supabase
    //     .schema('gris')
    //     .rpc('get_group_posts', {
    //         p_group_id: id,
    //         p_user_email: session.user!.email!,
    //     })

    console.log(posts, postsError);

    const { data: group, error: groupError }= await supabase
        .schema('gris')
        .from('groups')
        .select('*')
        .eq('id', id)
        .single()

    // const { data: membership, error: membershipError } = await supabase
    //     .schema('gris')
    //     .from('group_members')
    //     .select('id')
    //     .eq('group_id', id)
    //     .eq('user_id', )

    // SELECT * FROM POSTS 
    // WHERE group_id = (
    //  SELECT id FROM groups 
    //  WHERE id = ? 
    //  AND
    //   
    // )
    // const { data, error } = await supabase
    //     .schema('gris')
    //     .from('posts')
    //     .select(`
    //     *,
    //     group_members!inner(user_id)
    //     `)
    //     .eq('group_id', id)
    //     .eq('group_members.user_id', currentUserId);

    return (
        <div className="flex flex-col gap-4 rounded-lg w-[40vw] bg-amber-50/20 backdrop-blur-lg p-4 pt-1 overflow-y-hidden">
          
            {modal}

            <span className="flex gap-2 items-center w-full pb-1 border-b-2 border-slate-300/30">
            <div>
                {/* <div className="flex items-center justify-center w-[10px] h-[10px] rounded-4xl ml-auto bg-slate-200 text-slate-900 text-center shadow-2xl"></div> */}
                [ ]
            </div>
            <h5>{group?.name}</h5>
            </span>

            <Link 
                href={`/groups/${id}/modal`} 
                prefetch
                className="w-full"
            >
                <button className="flex justify-center items-center gap-1 w-full rounded-md bg-slate-300 text-slate-800 cursor-pointer active:bg-slate-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Adicionar música
                </button>
            </Link>

            <span className="flex gap-2 items-center w-full pb-1 border-b-2 border-slate-300/30">
            {/* <div>
                <div className="flex items-center justify-center w-[10px] h-[10px] rounded-4xl ml-auto bg-slate-200 text-slate-900 text-center shadow-2xl"></div>
            </div> */}
            <h5 className="text-lg text-white/80">Semana 1: 13/04 - 19/04</h5>
            </span>
            <div 
                className={`${style.overflow} flex flex-col gap-4`}
            >
                {posts?.map( post => 
                    <Post 
                        key={post.id}
                        post={post}
                    />
                )}
            </div>
          
        </div>
    )

}

function Post({ post }: { post: PostDB }) {

    return (
    <div className="flex flex-col bg-slate-500/50 rounded-md shadow-2xl">
        <span className="flex gap-2 items-center p-2 mx-2 border-b-2 border-slate-400/50 pl-[10.5px]">
            {(post.users.img_url !== 'NULL')
            ?
            <Image
                src={post.users.img_url!}
                alt={`${post.users.spotify_id} image`}
                width={35}
                height={35}
            ></Image>
            :
            <div className="flex justify-center items-center w-[35px] h-[35px] rounded-4xl bg-slate-800">{post.users.spotify_id[0].toUpperCase()}</div>
            }
            <div className="flex flex-col">
            <h3 className="text-md text-slate-50">{post.users.spotify_id}</h3>
            <h5 className="text-xs text-slate-300">{new Date(post.created_at).toLocaleString()}</h5>
            </div>
        </span>

        <Track track={post.tracks}/>
    
        {(post.message !== '')&&
        <div className="flex gap-2 items-center justify-start p-2 pl-0 mx-2 border-t-2 border-slate-400/50">
            <div className="flex justify-end w-[45px] min-w-[45px]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 stroke-amber-50/40">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
            </div>
            <p className="text-slate-200">{post.message}</p>
        </div>
        }
    </div>
    )

}