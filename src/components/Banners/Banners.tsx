
function GroupBanner() {

    return (
        <div className="flex justify-center gap-4 items-center w-full bg-radial-[at_50%_100%] from-blue-600 to-slate-950 h-25 rounded">
            <TopNote />
            <Groovy rotate={12} />
            <Groovy rotate={-10} mediaQuery />
            <BotNote />
            <Groovy rotate={-20} />
            <Groovy rotate={18} mediaQuery />
            <Groovy rotate={5} />
            <BotNote />
        </div>
    )

}

function PlaylistBanner() {

    return (
        <div className="flex justify-center gap-4 items-center w-full bg-radial-[at_50%_100%] from-blue-600 to-slate-950 h-25 rounded">
            <Groovy rotate={12} />
            <Groovy rotate={-10} mediaQuery />
            <MusicNotes />
            <MusicNotes />
            <Groovy rotate={18} mediaQuery />
            <Groovy rotate={5} />
        </div>
    )

}

interface GroovyProps {
    size?: number
    rotate: number
    mediaQuery?: boolean
}

function Groovy({ size, rotate, mediaQuery = false }: GroovyProps) {

    return (
        <svg width="50" height="50" viewBox="0 0 90 93" fill="none" xmlns="http://www.w3.org/2000/svg" 
        className={`${mediaQuery&& 'hidden md:block'}`}
        style={{ transform: `rotate(${rotate}deg)` }}
        >
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 81.5V45C12 26.7746 26.7746 12 45 12C63.2254 12 78 26.7746 78 45V81.5C78 87.5751 73.0751 92.5 67 92.5C60.9249 92.5 56 87.5751 56 81.5C56 87.5751 51.0751 92.5 45 92.5C38.9249 92.5 34 87.5751 34 81.5C34 87.5751 29.0751 92.5 23 92.5C16.9249 92.5 12 87.5751 12 81.5ZM60 38C54.4772 38 50 42.4772 50 48H54C54 48 54 42 60 42C66 42 66 48 66 48H70C70 42.4772 65.5229 38 60 38ZM30 38C24.4772 38 20 42.4772 20 48H24C24 48 24 42 30 42C36 42 36 48 36 48H40C40 42.4772 35.5228 38 30 38ZM54 60H30C30 60 30 70 42 70C54 70 54 60 54 60Z" fill="#F2E6D5"/>
        <rect y="38" width="12" height="23" fill="#F2E6D5"/>
        <rect x="78" y="38" width="12" height="23" fill="#F2E6D5"/>
        <path d="M84 42C84 20.4609 66.5391 3 45 3C23.4609 3 6 20.4609 6 42" stroke="#F2E6D5" stroke-width="5"/>
        </svg>

    )

}

function MusicNotes() {

    return (
        <div className="flex flex-col justify-evenly h-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 animate-pulse">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 animate-pulse">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
            </svg>
        </div>
    )

}

function TopNote() {

    return (
        <div className="flex flex-col justify-start h-full py-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 animate-pulse">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
            </svg>
        </div>
    )

}

function BotNote() {

    return (
        <div className="flex flex-col justify-end h-full py-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 animate-pulse">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
            </svg>
        </div>
    )

}


const Banners = {
    group: <GroupBanner />,
    playlist: <PlaylistBanner />
}

export default Banners