import { enterGroup } from "@/app/actions/actions"
import EmptyMessage from "@/components/EmptyMessage/EmptyMessage"
import GradientComponent from "@/components/Gradient/Gradient"
import Modal from "@/components/Modal/Modal"
import { authOptions } from "@/utils/authOptions"
import { dbAdmin } from "@/utils/db/supabase"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { redirect } from "next/navigation"

type Params = Promise<{ token: string }>
export default async function Invite(
    { params }: { params: Params }
) {

    const { token } = await params

    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
        redirect(`/api/auth/signin?callbackUrl=/groups/invite/${token}`)
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
        redirect(`/api/auth/signin?callbackUrl=/groups/invite/${token}`)
    }

    const { data: group, error: groupError } = await supabase
        .schema('gris') 
        .from('groups')
        .select('*')
        .eq('invite_token', token)
        .single()
    if (groupError || !group.id) {
        console.error('Supabase could not fetch group')
        redirect(`/api/auth/signin?callbackUrl=/groups/invite/${token}`)
    }

    const { data: member, error: memberError } = await supabase
        .schema('gris')
        .from('group_members')
        .select('*')
        .eq('user_id', user.id)
        .eq('group_id', group.id)
        .single()

    if(memberError) {
        console.error('Supabase could not fetch members')
    }
    if(member) {
        console.error('User is already a member')
        return (
            <Modal
                header="Convite"
                size="small"
            >
                <Link 
                    href='/' prefetch
                    className="flex px-2 py-1 gap-2 justify-center items-center border-2 border-amber-50/20 bg-amber-50/80 hover:bg-amber-50/90 text-neutral-800 transition-colors rounded cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                    </svg>
                    Voltar
                </Link>
                <EmptyMessage message={`Você já é membro do grupo ${group.name}`}/>
            </ Modal>

        )
    }

    return (
        <Modal
            header="Convite grupo"
            size="small"
        >
        <form 
            action={enterGroup}
            className="flex flex-col gap-4 justify-center"
        >
            <input type="hidden" name="group_id" value={group.id} />
            <input type="hidden" name="user_id" value={user.id} />
            <div className="relative flex flex-col items-center gap-2">
                <h2 className="text-lg">
                    Você foi convidado a se tornar um membro do grupo:</h2>
                <p className="flex gap-2 justify-center items-center p-2 text-xl backdrop-blur-lg bg-amber-50/0 text-amber-50 text-center border-2 border-amber-50/20 w-full rounded italic">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                    </svg>
                    {group.name}
                </p>                
            </div>
            <button
                type="submit" 
                className="flex gap-2 justify-center items-center py-2 border-2 border-amber-50/20 bg-amber-50/90 hover:bg-amber-50/90 text-neutral-800 transition-colors cursor-pointer rounded"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>
                Entrar no grupo
            </button>
        </form>
        </Modal>
    )

}