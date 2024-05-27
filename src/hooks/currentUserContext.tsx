import { createContext, ReactNode, useContext } from "react";
import { IUser } from "../Interfaces/IUser";


interface currentUserProps {
    children: ReactNode
}

interface ICurrentUserContext {
    currentUser: IUser
}

const CurrentUserContext = createContext<ICurrentUserContext>({} as ICurrentUserContext)

export function CurrentUserContextProvider({ children }: currentUserProps) {
    const currentUser = JSON.parse(sessionStorage.getItem("loggedUser") || "[]")

    return (
        < CurrentUserContext.Provider value={{
            currentUser
        }}>
            {children}
        </CurrentUserContext.Provider>
    )
}

export function useCurrentUserContext() {

    const context = useContext(CurrentUserContext)

    return context
}