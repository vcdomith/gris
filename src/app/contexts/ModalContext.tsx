import { act, createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react"

interface ModalContextProps {
    loadingState: [boolean, Dispatch<SetStateAction<boolean>>]
}

export const ModalContext = createContext<ModalContextProps | undefined>(undefined)
ModalContext.displayName = 'Modal'

export const useModal = () => {
    const context = useContext(ModalContext)
    if (!context) throw new Error('useModal must be used within a ModalProvider')
    return context
}

export const ModalProvider = ({ children }: { children: ReactNode }) => {

    const [loading, setLoading] = useState(false)

    return <ModalContext.Provider
        value={{
            loadingState: [loading, setLoading],
        }}
    >
        {children}
    </ModalContext.Provider>

}
