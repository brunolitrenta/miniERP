import { useEffect, useState } from "react"
import { IUser } from "../../Interfaces/IUser"
import styles from "./dataComponent.module.scss"
import { ICompany } from "../../Interfaces/ICompany"

export function Data() {

    const savedTheme = localStorage.getItem("theme")

    const accessLevel = sessionStorage.getItem("accessLevel")

    const [users, setUsers] = useState<Array<IUser>>(JSON.parse(localStorage.getItem("users") || "[]"))

    const [companies, setCompanies] = useState<Array<ICompany>>(JSON.parse(localStorage.getItem("companies") || "[]"))

    const [showedComponent, setShowedComponent] = useState<number>(1)



    useEffect(() => {
        localStorage.setItem("users", JSON.stringify(users))
    }, [users])


    function activateUser(user: IUser) {
        setUsers((prevState) => {
            const newArr = prevState.filter((ps) => ps.id != user.id)
            const _user = { ...user, active: !user.active }
            return [...newArr, _user]
        })
    }

    function activateCompany(company: ICompany) {
        setCompanies((prevState) => {
            const newArr = prevState.filter((ps) => ps.id != company.id)
            const _company = { ...company, active: !company.active }
            return [...newArr, _company
            ]
        })
    }


    return (
        <div className={savedTheme == "light" ? styles.light : styles.dark}>
            <nav className={styles.navMenu}>
                <button className={styles.navButton} onClick={() => setShowedComponent(1)}>Users</button>
                <button className={styles.navButton} onClick={() => setShowedComponent(2)}>Companies</button>
            </nav>
            <button className={styles.addButton}>+</button>
            {
                {
                    1: <div className={styles.grid}>
                        {
                            accessLevel == "admin"
                                ? users.sort(function sortArray(a: IUser, b: IUser) {
                                    if (a.id < b.id) {
                                        return -1
                                    }
                                    if (a.id > b.id) {
                                        return 1
                                    }
                                    return 0
                                }).map((user: IUser) => {
                                    return (
                                        <div key={user.id} className={savedTheme == "light" ? styles.dataLight : styles.dataDark}>
                                            <p>Id: {user.id}</p>
                                            <p>Name: {user.name}</p>
                                            <p>Email: {user.email}</p>
                                            <p>Password: {user.password}</p>
                                            <p>Access Level: {user.accessLevel}</p>
                                            <p>Company Id: {user.companyId}</p>
                                            <div className={styles.activeSection}>
                                                <p>Active: {user.active ? "true" : "false"}</p>
                                                <button className={!user.active ? styles.buttonActive : styles.buttonInactive} onClick={() => activateUser(user)}>{user.active ? "Deactivate" : "Activate"}</button>
                                            </div>
                                        </div>
                                    )
                                })
                                : users.sort().map((user: IUser) => {
                                    return (
                                        <div key={user.id} className={savedTheme == "light" ? styles.dataLight : styles.dataDark}>
                                            <p>Id: {user.id}</p>
                                            <p>Name: {user.name}</p>
                                            <p>Email: {user.email}</p>
                                            <p>Password: {user.password}</p>
                                            <p>Access Level: {user.accessLevel}</p>
                                            <p>Company Id: {user.companyId}</p>
                                            <p>Active: {user.active ? "true" : "false"}</p>
                                        </div>
                                    )
                                })
                        }
                    </div>,
                    2: <div className={styles.grid}>
                        {
                            accessLevel == "admin"
                                ? companies.sort(function sortArray(a: ICompany, b: ICompany) {
                                    if (a.id < b.id) {
                                        return -1
                                    }
                                    if (a.id > b.id) {
                                        return 1
                                    }
                                    return 0
                                }).map((company: ICompany) => {
                                    return (
                                        <div key={company.id} className={savedTheme == "light" ? styles.dataLight : styles.dataDark}>
                                            <p>Id: {company.id}</p>
                                            <p>Company name: {company.companyName}</p>
                                            <p>CNPJ: {company.CNPJ}</p>
                                            <div className={styles.activeSection}>
                                                <p>Active: {company.active ? "true" : "false"}</p>
                                                <button className={!company.active ? styles.buttonActive : styles.buttonInactive} onClick={() => activateCompany(company)}>
                                                    {company.active ? "Deactivate" : "Activate"}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                                : companies.sort().map((company: ICompany) => {
                                    return (
                                        <div key={company.id} className={savedTheme == "light" ? styles.dataLight : styles.dataDark}>
                                            <p>Id: {company.id}</p>
                                            <p>Company name: {company.companyName}</p>
                                            <p>CNPJ: {company.CNPJ}</p>
                                            <p>Active: {company.active ? "true" : "false"}</p>
                                        </div>
                                    )
                                })
                        }
                    </div>
                }[showedComponent]
            }
        </div>
    )
}