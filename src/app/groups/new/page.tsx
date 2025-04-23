import { createGroup } from "@/app/actions/actions"
import { authOptions } from "@/utils/authOptions"
import { dbAdmin } from "@/utils/db/supabase"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

const supabase = dbAdmin()

export default async function NewGroup() {

    const session = await getServerSession(authOptions)

    if (!session) {
        redirect(`/api/auth/signin`)
    }

    const { data: user, error } = await supabase
        .schema('gris')
        .from('users')
        .select('id')
        .eq('email', (session.user!.email as string))
        .single()

    if (error || !user) {
        console.error('Supabase id error', error)
        return <div>User not registered</div>
    }

    return (

        <>
        <span>
            <h1>Criar Novo Grupo</h1>
        </span>

        <form action={createGroup}>
            <input 
                autoComplete="off"
                type="text" 
                placeholder="Nome Grupo" 
                name="name"
                required
                className="border-2 border-amber-50/30 focus:border-amber-50/50 focus:outline-none px-2 rounded-sm"
            />
            <input 
                type="hidden" 
                value={user.id} 
                name="id"
            />
            <button 
                type="submit" 
                className="cursor-pointer bg-amber-50/20 hover:bg-amber-50/30 transition-colors px-2 py-1 rounded-sm"
            >Criar grupo</button>
        </form>
        </>
    )

}