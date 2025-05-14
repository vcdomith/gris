import { ReactNode } from "react";

export default async function PlaylistLayout(
    {modal, children}:
    { modal: ReactNode, children: ReactNode }
) {

    return (
        <>
        {modal}
        {children}
        </>
    )

}