import { ReactNode } from "react";

interface ContainerProps {

    size: Sizes
    header?: ReactNode | string
    blur?: boolean
    children: ReactNode
}

export type Sizes = 'small' | 'large'

const SIZES: Record<Sizes, string> = {
    small: "flex flex-col gap-4 p-2 pt-1 rounded bg-neutral-500/50 border-2 border-neutral-500/20 backdrop-blur-lg z-1000",
    large: "flex flex-col bg-neutral-500/50 backdrop-blur-2xl w-full min-w-full md:w-[80dvw] md:min-w-[80dvw] lg:w-[40dvw] lg:min-w-[40dvw] lg:max-w-[calc(600px-6rem)] h-[80dvh] p-2 pt-1 border-2 border-slate-500/30 rounded-md overflow-hidden z-1000"
}

export default function Container({ size, header, children, blur = false }: ContainerProps) {

    return (
        <div className="relative flex items-center justify-center w-full md:w-fit h-fit z-1000 cursor-default px-4">
            {blur&& <BlurBg/>}
            <div className={SIZES[size]}>
                <DefaultHeader header={header} />
                {children}
            </div>
        </div>
    )

}

const DefaultHeader = ({ header }: { header?: ReactNode | string }) => {

    if (header === undefined) return null;

    if (typeof header === 'string') {
        return (
            <span className="flex justify-between border-b-2 border-amber-50/20">
                <h3>{header}</h3>
            </span>
        )
    }

    return header as ReactNode

}

function BlurBg() {
    return (
        <section 
            className="flex justify-center items-center fixed top-0 left-0 w-full h-dvh bg-neutral-900/50 backdrop-blur-sm transition z-998"
        >
        </section>
    )
}