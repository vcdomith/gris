import { ReactNode } from "react";

export default function Modal({ children }: { children: ReactNode}) {

    return (
        <div className="flex justify-center items-center fixed top-0 left-0 w-full h-dvh z-998">
            <section 
                className="fixed top-0 left-0 w-full h-full bg-neutral-900/50 backdrop-blur-sm z-998 cursor-alias"
            >
                <div className="relative flex items-center justify-center h-full z-1000 cursor-default">
                    {children}
                </div>
            </section>
        </div>
    )

}