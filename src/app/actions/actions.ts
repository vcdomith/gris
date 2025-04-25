'use server'
import { Post } from '@/components/NewPost/NewPost'
import { dbAdmin } from '@/utils/db/supabase'
import crypto from 'crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const supabase = dbAdmin()

export async function createGroup(formData: FormData) {

    const inviteToken = crypto.randomBytes(32).toString('hex')

    const rawFormData = {
        name: formData.get('name') as string,
        created_by: parseInt(formData.get('id') as string),
        invite_token: inviteToken,
    }

    const { data: groupData, error: groupError } = await supabase
        .schema('gris')
        .from('groups')
        .insert(rawFormData)
        .select()

    console.log(groupData, groupError);

    if (groupError || !groupData?.[0] ) {
        throw new Error(groupError?.message ?? 'Failed to create group')
    }

    const groupId = groupData[0].id
    const userId = rawFormData.created_by

    const { error: memberError } = await supabase
        .schema('gris')
        .from('group_members')
        .insert({
            group_id: groupId,
            user_id: userId
        })

    if (memberError) {
        throw new Error(memberError?.message ?? 'Failed to create member in group')
    }

    console.log(rawFormData);

    redirect('/')

}

export async function createPost(newTrack: Post, email: string, group_id: string) {

    const { message, ...trackRest } = newTrack

    const { data: user, error: userError } = await supabase
        .schema('gris')
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

    if (userError || !user.id ) {
        throw new Error(userError?.message ?? 'Failed to fetch user id')
    }

    const { data: track, error: trackError } = await supabase
        .schema('gris')
        .from('tracks')
        .insert(trackRest)
        .select()
        .single()

    if (trackError || !track?.id ) {
        throw new Error(trackError?.message ?? 'Failed to insert track')
    }

    const { error: postError } = await supabase
        .schema('gris')
        .from('posts')
        .insert({
            track_id: track.id,
            user_id: user?.id,
            group_id: parseInt(group_id),
            message: message,
        })

    if (postError) {
        throw new Error(postError?.message ?? 'Failed to insert post')
    }
    revalidatePath(`/groups/${group_id}`)

}

export async function enterGroup(formData: FormData) {

    const rawFormData = {
        group_id: formData.get('group_id') as string,
        user_id: formData.get('user_id') as string,
    }

    console.log(rawFormData);

    const { error: membersError } = await supabase
        .schema('gris')
        .from('group_members')
        .insert({
            group_id: parseInt(rawFormData.group_id),
            user_id: parseInt(rawFormData.user_id),
        })

    if (membersError) {
        throw new Error(membersError?.message ?? 'Failed to insert member into group')
    }

    redirect('/')

}