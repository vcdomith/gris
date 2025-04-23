import { ReactNode } from "react";

export default async function GroupLayout(
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