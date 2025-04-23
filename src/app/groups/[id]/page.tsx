import GradientComponent from "@/components/Gradient/Gradient";
import { authOptions } from "@/utils/authOptions";
import { dbAdmin } from "@/utils/db/supabase";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type Params = Promise<{ id: number }>
export default async function Group(
    { params, modal }: { params: Params, modal: ReactNode }
) {

    const { id } = await params
    // console.log(id);

    const session = await getServerSession(authOptions)
    
    if (!session) {
        redirect(`/api/auth/signin?callbackUrl=/groups/${id}`)
    }
    // console.log(session);

    const supabase = dbAdmin()

    // Using a remote procedure call, a postgres function that first checks if the user belongs to the curent group, if it does then queries the posts of this groups descending
    const { data: posts, error: postsError } = await supabase
        .schema('gris')
        .rpc('get_group_posts', {
            p_group_id: id,
            p_user_email: session.user!.email!,
        })

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
        <div className="flex flex-col gap-4 rounded-lg w-[40vw] h-[calc(100dvh-4rem)] bg-amber-50/20 backdrop-blur-lg p-4 pt-1 overflow-y-hidden">
          
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
                <button className="w-full rounded-md bg-slate-300 text-slate-800 cursor-pointer">Adicionar música</button>
            </Link>

            <span className="flex gap-2 items-center w-full pb-1 border-b-2 border-slate-300/30">
            {/* <div>
                <div className="flex items-center justify-center w-[10px] h-[10px] rounded-4xl ml-auto bg-slate-200 text-slate-900 text-center shadow-2xl"></div>
            </div> */}
            <h5 className="text-lg text-white/80">Semana 1: 13/04 - 19/04</h5>
            </span>
          
        </div>
    )

}