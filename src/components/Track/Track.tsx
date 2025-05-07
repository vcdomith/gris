import Image from "next/image";
import { Post } from "../NewPost/NewPost";
import { ReactNode } from "react";

interface TrackProps {
    img: string
    name: string
    artist: string

    size?: number
    author?: ReactNode
    omitPadding?: boolean
}

export default function Track({ img, name, artist, size = 45, author, omitPadding = false }: TrackProps ) {

    return (
        <span 
            // className=" flex gap-2 items-center p-2 border-2 border-amber-50/10 bg-amber-50/5 hover:bg-amber-50/10 cursor-pointer transition-colors rounded shadow-sm"
            className={`flex gap-2 items-center ${omitPadding ?'p-0' : 'p-2'} transition-colors rounded `}
        >
            <Image 
                src={img} 
                alt='track image'
                width={size}
                height={size}
                className={`h-[${size}px] w-[${size}px] rounded`}
            ></Image>
            <div className="flex flex-col">
                <p className="font-bold">{name}</p>
                <p className="text-sm text-neutral-300/80">{artist}</p>
                {author}
            </div>
        </span>
    )

}