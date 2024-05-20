import { useEffect, useState } from "react"
import { IUser } from "../../Interfaces/IUser"
import styles from "./dataComponent.module.scss"
import { ICompany } from "../../Interfaces/ICompany"
import { Modal } from "../modalComponent/modalComponent"

export function Data() {

    const savedTheme = localStorage.getItem("theme")

    const currentUser: IUser = JSON.parse(sessionStorage.getItem("loggedUser") || "[]")

    const [users, setUsers] = useState<Array<IUser>>(JSON.parse(localStorage.getItem("users") || "[]"))

    const [filterUsers, setFilterUsers] = useState<Array<IUser>>([])

    const companies: Array<ICompany> = (JSON.parse(localStorage.getItem("companies") || "[]"))

    const [filterCompanies, setFilterCompanies] = useState<Array<ICompany>>([])

    const [showedComponent, setShowedComponent] = useState<number>(1)

    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        localStorage.setItem("users", JSON.stringify(users))
        filterData()
    }, [users])

    function activateUser(user: IUser) {
        setUsers((prevState) => {
            const newArr = prevState.filter((ps) => ps.id != user.id)
            const _user = { ...user, active: !user.active }
            return [...newArr, _user]
        })
    }

    function filterData() {
        setFilterUsers(() => {
            const newArr = users.filter((ps) => ps.companyId == currentUser.companyId)
            return [...newArr]
        })

        setFilterCompanies(() => {
            const newArr = companies.filter((ps) => ps.id == currentUser.companyId)
            return [...newArr]
        })
    }

    return (
        <div className={savedTheme == "light" ? styles.light : styles.dark}>
            <nav className={styles.navMenu}>
                <button className={styles.navButton} onClick={() => setShowedComponent(1)}>Users</button>
                <button className={styles.navButton} onClick={() => setShowedComponent(2)}>Company</button>
            </nav>
            {
                {
                    1: <div className={styles.grid}>
                        {
                            currentUser.accessLevel == "admin"
                                ? filterUsers.sort(function sortArray(a: IUser, b: IUser) {
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
                                : filterUsers.map((user: IUser) => {
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
                        <button className={styles.addButton} onClick={() => setIsOpen(true)}>+</button>
                        <Modal isOpen={isOpen} close={() => setIsOpen(!isOpen)} />
                    </div>,
                    2: <div className={styles.grid}>
                        {
                            currentUser.accessLevel == "admin"
                                ? filterCompanies.sort(function sortArray(a: ICompany, b: ICompany) {
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
                                            <p>Active: {company.active ? "true" : "false"}</p>
                                        </div>
                                    )
                                })
                                : filterCompanies.map((company: ICompany) => {
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
                        <button className={styles.addButton}>+</button>
                    </div>
                }[showedComponent]
            }
        </div>
    )
}