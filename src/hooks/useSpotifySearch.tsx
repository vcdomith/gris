import { SpotifySearchResponse } from "@/interfaces/Spotify";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const fetchSongs = async (query: string, token: string | undefined) => {
    console.log('fetchsongs', query, token);
    const res = await fetch(`/api/spotify/search?q=${query}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (!res.ok) {
        throw new Error('Search failed')
    }
    return res.json()
}

export default function useSpotifySeach(query: string, token: string | undefined): UseQueryResult<SpotifySearchResponse> {

    return useQuery<SpotifySearchResponse>({
        queryKey: ['spotify-search', query],
        queryFn: () => fetchSongs(query, token),
        enabled: !!query && !!token,
        staleTime: 1000 * 60,
    })

}