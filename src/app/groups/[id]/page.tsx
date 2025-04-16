import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Params = Promise<{ id: number }>
export default async function Group({ params }: { params: Params }) {

    const { id } = await params
    console.log(id);

    const session = await getServerSession(authOptions)
    
    if (!session) {
        redirect(`/api/auth/signin?callbackUrl=/groups/${id}`)
    }

    return (
        <div>{id}</div>
    )

}