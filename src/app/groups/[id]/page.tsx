import GradientComponent from "@/components/Gradient/Gradient";
import { authOptions } from "@/utils/authOptions";
import { dbAdmin } from "@/utils/db/supabase";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const supabase = dbAdmin()

type Params = Promise<{ id: number }>
export default async function Group(
    { params }: { params: Params }
) {

    const { id } = await params
    console.log(id);

    const session = await getServerSession(authOptions)
    
    if (!session) {
        redirect(`/api/auth/signin?callbackUrl=/groups/${id}`)
    }
    console.log(session);

    // Using a remote procedure call, a postgres function that first checks if the user belongs to the curent group, if it does then queries the posts of this groups descending
    const { data, error } = await supabase
        .schema('gris')
        .rpc('get_group_posts', {
            p_group_id: id,
            p_user_email: session.user!.email!,
        })

    console.log(data, error);

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
        <div>
            {id}
            {/* {id} */}
            {/* <GradientComponent /> */}
        </div>
    )

}