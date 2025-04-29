import Image from "next/image";
import { Post } from "../NewPost/NewPost";

export default function Track({ track }: { track: Omit<Post, 'message' | 'spotify_id'> }) {

    return (
        <span 
            // className=" flex gap-2 items-center p-2 border-2 border-amber-50/10 bg-amber-50/5 hover:bg-amber-50/10 cursor-pointer transition-colors rounded shadow-sm"
            className=" flex gap-2 items-center p-2 transition-colors rounded"
        >
            <Image 
                src={track.img_url} 
                alt='track image'
                width={45}
                height={45}
                className="h-[45px] w-[45px] rounded"
            ></Image>
            <div className="flex flex-col">
                <p className="font-bold">{track.name}</p>
                <p className="text-sm text-neutral-300/80">{track.artist}</p>
            </div>
        </span>
    )

}