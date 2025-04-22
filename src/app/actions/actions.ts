'use server'
import { dbAdmin } from '@/utils/db/supabase'
import crypto from 'crypto'
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

    console.log(rawFormData);

    redirect('/')

}