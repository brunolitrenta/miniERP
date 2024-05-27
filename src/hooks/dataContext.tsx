import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { IUser } from "../Interfaces/IUser";
import { ICompany } from "../Interfaces/ICompany";

interface DataProps {
    children: ReactNode
}

interface IDataContext {
    users: Array<IUser>,
    setUsers: Dispatch<SetStateAction<Array<IUser>>>,
    companies: Array<ICompany>,
    setCompanies: Dispatch<SetStateAction<Array<ICompany>>>,
}

const DataContext = createContext<IDataContext>({} as IDataContext)

export function DataContextProvider({ children }: DataProps) {

    const [users, setUsers] = useState<Array<IUser>>(JSON.parse(localStorage.getItem("users") || "[]"))

    const [companies, setCompanies] = useState<Array<ICompany>>(JSON.parse(localStorage.getItem("companies") || "[]"))

    useEffect(() => {
        localStorage.setItem("users", JSON.stringify(users))
    }, [users])

    useEffect(() => {
        localStorage.setItem("companies", JSON.stringify(companies))
    }, [companies])

    return (
        <DataContext.Provider value={{
            users,
            setUsers,
            companies,
            setCompanies,
        }}>
            {children}
        </DataContext.Provider>
    )

}

export function useData() {

    const context = useContext(DataContext)

    return context
}