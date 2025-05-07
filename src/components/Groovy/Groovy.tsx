
interface GroovyProps {
    animate?: boolean
    size?: number
}

export default function Groovy({ animate = false, size = 35 }: GroovyProps) {

    return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M17 81.5V45C17 26.7746 31.7746 12 50 12C68.2254 12 83 26.7746 83 45V81.5C83 87.5751 78.0751 92.5 72 92.5C65.9249 92.5 61 87.5751 61 81.5C61 87.5751 56.0751 92.5 50 92.5C43.9249 92.5 39 87.5751 39 81.5C39 87.5751 34.0751 92.5 28 92.5C21.9249 92.5 17 87.5751 17 81.5ZM65 38C59.4772 38 55 42.4772 55 48H59C59 48 59 42 65 42C71 42 71 48 71 48H75C75 42.4772 70.5228 38 65 38ZM35 38C29.4772 38 25 42.4772 25 48H29C29 48 29 42 35 42C41 42 41 48 41 48H45C45 42.4772 40.5228 38 35 38ZM59 60H35C35 60 35 70 47 70C59 70 59 60 59 60Z" fill="#2D28C3" className={`fill-amber-50 ${animate&& 'animate-float'}`}/>
        </svg>
    )

}