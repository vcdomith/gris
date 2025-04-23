import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    const query = req.nextUrl.searchParams.get('q')
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')

    if (!query || !token) {
        return NextResponse.json({ error: 'Missing query or token' }, { status: 400 })
    }

    console.log(query, token);

    const res = await fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(query)}&limit=5`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = await res.json()
    console.log(data);
    return NextResponse.json(data)

}