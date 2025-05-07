import Track from "@/components/Track/Track";
import { authOptions } from "@/utils/authOptions";
import { dbAdmin } from "@/utils/db/supabase";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import style from './groups.module.css'

import { isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns'
import EmptyMessage from "@/components/EmptyMessage/EmptyMessage";
import ClientButton from "@/components/ClientButton/ClientButton";
import Invite from "@/components/Invite/Invite";
import ButtonWatcher from "@/components/ButtonWatcher/ButtonWatcher";

function groupPostsByDate(posts: PostDB[]): Record<string, PostDB[]> {

    posts.sort((a, b) => b.id - a.id)
    const groups: Record<string, PostDB[]> = {}

    for (const post of posts) {

        const date = new Date(post.created_at)

        let label = 'Mais Antigo'

        if (isToday(date)) label = 'Hoje'
        else if (isYesterday(date)) label = 'Ontem'
        else if (isThisWeek(date)) label = 'Essa Semana'
        else if (isThisMonth(date)) label = 'Esse Mês'

        if (!groups[label]) groups[label] = []
        groups[label].push(post)

    }

    return groups

}

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

interface GroupMember {
    user_id: number;
    users: {
        id: number;
        spotify_id: string;
        img_url: string | null;
    }
}

type Params = Promise<{ id: number }>
export default async function Group(
    { params }: { params: Params }
) {

    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || !session?.user?.email) {
        redirect(`/api/auth/signin?callbackUrl=/groups/${id}`)
    }

    const supabase = dbAdmin()

    const { data: userWithMembership, error: userError } = await supabase
        .schema('gris')
        .from('users')
        .select(`
            id,
            email,
            group_members (
                group_id
            )
        `)
        .eq('email', session.user.email)
        .eq('group_members.group_id', id)
        .single()
    console.log(userWithMembership);

    if (userError || !userWithMembership?.id) {
        console.error('Supabase could not fetch user')
        redirect(`/api/auth/signin?callbackUrl=/groups/${id}`)
    }

    const isMember = userWithMembership.group_members.length === 1
    if (!isMember) {
        console.error('Usuário não é membro do grupo')
        redirect('/')
    }

    const { data: groupData, error: groupError } = await supabase
    .schema('gris')
    .from('groups')
    .select(`
        *,
        group_members (
            user_id,
            users (
                id,
                spotify_id,
                img_url
            )
        ),
        posts (
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
        )
    `)
    .eq('id', id)
    .single()

    if (!groupData || groupError) {
        console.error('Error fetching groupData from supabase', groupError)
        redirect('/')
    }

    const { posts, name, group_members, invite_token } = groupData

    console.log(group_members);

    const groupedPosts = (posts) ? groupPostsByDate(posts) : []

    return (
        <>
            <ButtonWatcher groupId={id} />
            <div className="flex flex-col gap-4 rounded-lg w-full bg-amber-50/10 md:bg-amber-50/20 backdrop-blur-lg p-4 pt-1 overflow-y-hidden md:w-[60dvw] lg:w-[40dvw]">
            
                <span className="flex gap-2 justify-between items-center w-full pb-1 border-b-2 border-slate-300/30">
                
                    <div className="flex gap-0.5 items-center overflow-hidden">
                    <span className="flex gap-0.5 items-center">
                        <Link 
                            href={`/`} 
                            prefetch
                            className="text-amber-50/30"
                        >
                            Grupos
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" className="stroke-amber-50/30"/>
                        </svg>
                    </span>
                    <h5 className="truncate">{name}</h5>
                    </div>

                    <span className="flex gap-2 justify-end items-center">
                        <ClientButton 
                            render={<Invite token={invite_token}/>}
                            title='Criar convite para grupo:'
                            className='flex gap-1 items-center text-sm transition-colors hover:bg-amber-50/20 cursor-pointer rounded px-1 py-0.5 focus:outline-none focus:bg-amber-50/20 ml-auto'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                            </svg>
                            <p className="hidden sm:block">
                                Convidar
                            </p>
                        </ClientButton>

                        <ClientButton 
                            render={<Invite token={invite_token}/>}
                            title='Criar convite para grupo:'
                            className='flex gap-1 items-center text-sm transition-colors hover:bg-amber-50/20 cursor-pointer rounded px-1 py-0.5 focus:outline-none focus:bg-amber-50/20'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                            </svg>
                        </ClientButton>
                    </span>
                    

                </span>

                <Link 
                    href={`/groups/${id}/modal`}
                    id='observed' 
                    prefetch
                    className="flex justify-center items-center gap-1 w-full rounded-md py-1 bg-slate-300 hover:bg-slate-200 text-slate-800 cursor-pointer active:bg-slate-400 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Adicionar música
                </Link>

                <div 
                    className={`${style.overflow} flex flex-col gap-4`}
                >

                    {(posts && posts.length > 0)
                    ?
                    Object.entries(groupedPosts).map(([label, group]) => 
                        <div 
                            key={label}
                            className="flex flex-col gap-4"
                        >
                            <span className="flex items-center gap-2">
                                <h5 className="text-sm text-white/80 w-max whitespace-nowrap">{label}</h5>
                                <hr className="w-full border-amber-50/20" />
                            </span>
                            {group.map( post => 
                                <Post key={post.id} post={post}/>
                            )}
                        </div>
                    )
                    :
                    <EmptyMessage message="Nenhum post foi criado no grupo ainda, crie um!" />
                    }
                </div>
            
            </div>
        </>
    )

}

function Post({ post }: { post: PostDB }) {

    return (
    <div className="flex flex-col bg-slate-400/20 md:bg-slate-500/50 rounded-md shadow-2xl">
{/* 
        <span className="flex gap-2 items-center py-2 mx-2 pl-[27.5px] border-b-2 border-slate-400/30">
            {(post.users.img_url !== 'NULL')
            ?
            <Image
                src={post.users.img_url!}
                alt={`${post.users.spotify_id} image`}
                width={25}
                height={25}
            ></Image>
            :
            <div className="flex justify-center items-center w-[25px] h-[25px] rounded-4xl bg-slate-800 text-sm/snug">{post.users.spotify_id[0].toUpperCase()}</div>
            }
            <div className="flex">
            <h3 className="text-slate-50">{post.users.spotify_id}</h3>
            <h5 className="text-xs text-slate-300">{new Date(post.created_at).toLocaleString()}</h5>
            </div>
        </span> */}
    
        
        <Track 
            img={post.tracks.img_url} 
            name={post.tracks.name} 
            artist={post.tracks.artist}
            size={60}
            author={
                <span className="flex gap-1 items-center border-slate-400/30 pt-1">
                    {(post.users.img_url !== 'NULL')
                    ?
                    <Image
                        src={post.users.img_url!}
                        alt={`${post.users.spotify_id} image`}
                        width={20}
                        height={20}
                    ></Image>
                    :
                    <div className="flex justify-center items-center w-[20px] h-[20px] rounded-4xl bg-slate-800 text-xs/snug">{post.users.spotify_id[0].toUpperCase()}</div>
                    }
                    <div className="flex">
                    <h3 className="text-amber-50/50 text-sm">{post.users.spotify_id}</h3>
                    {/* <h5 className="text-xs text-slate-300">{new Date(post.created_at).toLocaleString()}</h5> */}
                    </div>
                </span> 
            }
        />

        {(post.message !== '')&&
        <div className="flex items-start justify-start p-2 pl-0 m-2 mt-0 bg-neutral-50/10 rounded">
            <div className="flex justify-center w-[30px] min-w-[30px]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 stroke-amber-50/80">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
            </div>
            <p className="text-slate-200 text-md pl-2 border-l-2 border-amber-50/10">{post.message}</p>
        </div>
        }
    </div>
    )

}

function MemberList({ members }: { members: GroupMember[] }) {

    return (
        <ul>
            {members.map( member => 
                <li key={member.user_id}>
                    {member.users.spotify_id}
                </li>
            )}
        </ul>
    )

}
