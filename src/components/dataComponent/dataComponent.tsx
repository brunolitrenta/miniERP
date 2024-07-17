/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { IUser } from "../../Interfaces/IUser"
import styles from "./dataComponent.module.scss"
import { ICompany } from "../../Interfaces/ICompany"
import plus from "../../assets/plus-solid.svg"
import editDark from "../../assets/pen-to-square-white.svg"
import editLight from "../../assets/pen-to-square-solid.svg"
import { ModalUsers } from "../modalUsers/modalUsers"
import { ModalCompany } from "../modalCompany/modalCompany"
import { useData } from "../../hooks/dataContext"
import { useCurrentUserContext } from "../../hooks/currentUserContext"

export function Data() {

    const { companies, users, setUsers } = useData()

    const { currentUser } = useCurrentUserContext()

    const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false)

    const [isCompanyModalOpen, setIsCompanyModalOpen] = useState<boolean>(false)

    const [userBeingEdited, setUserBeingEdited] = useState<IUser | null>(null)

    const [filterUsers, setFilterUsers] = useState<Array<IUser>>([])

    const [companyBeingEdited, setCompanyBeingEdited] = useState<ICompany | null>(null)

    const [filterCompanies, setFilterCompanies] = useState<Array<ICompany>>([])

    const [showedComponent, setShowedComponent] = useState<number>(1)

    const savedTheme = localStorage.getItem("theme")

    useEffect(() => {
        localStorage.setItem("users", JSON.stringify(users))
        filterData()
    }, [users])

    useEffect(() => {
        filterData()
    }, [companies])

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
                <button className={showedComponent == 1 ? styles.activeNavButton : styles.inactiveNavButton} onClick={() => setShowedComponent(1)}>Users</button>
                <button className={showedComponent == 2 ? styles.activeNavButton : styles.inactiveNavButton} onClick={() => setShowedComponent(2)}>Company</button>
            </nav>
            {
                {
                    1: <div className={styles.grid}>
                        {
                            currentUser.accessLevel == "admin"
                                ? filterUsers.sort((a: IUser, b: IUser) => a.id < b.id ? -1 : 1).map((user: IUser) => {
                                    return (
                                        <div key={user.id} className={savedTheme == "light" ? styles.dataLight : styles.dataDark}>
                                            <div className={styles.cardTop}>
                                                <p>Id: {user.id}</p>
                                                <button onClick={() => { setUserBeingEdited(user); setIsUserModalOpen(true) }}>
                                                    <img src={savedTheme == "light" ? editLight : editDark} alt="" />
                                                </button>
                                            </div>
                                            <p>Name: {user.name}</p>
                                            <p>Email: {user.email}</p>
                                            <p>Password: {user.password}</p>
                                            <p>Access Level: {user.accessLevel}</p>
                                            <p>Company Id: {user.companyId}</p>
                                            <div className={styles.activeSection}>
                                                <p>Active: {user.active ? "true" : "false"}</p>
                                                <button className={!user.active ? styles.buttonActive : styles.buttonInactive} onClick={() => activateUser(user)}>
                                                    {user.active ? "Deactivate" : "Activate"}
                                                </button>
                                            </div>

                                        </div>
                                    )
                                })
                                : filterUsers.sort((a: IUser, b: IUser) => a.id < b.id ? -1 : 1).map((user: IUser) => {
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
                        {
                            currentUser.accessLevel == "admin"
                                ? <button className={styles.addButton} onClick={() => { setIsUserModalOpen(true) }}>
                                    <img src={plus}></img>
                                </button>
                                : null
                        }
                        <ModalUsers isOpen={isUserModalOpen}
                            setIsOpen={setIsUserModalOpen}
                            userBeingEdited={userBeingEdited}
                            setUserBeingEdited={setUserBeingEdited}
                            savedTheme={savedTheme}
                        />
                    </div>,
                    2: <div className={styles.grid}>
                        {
                            currentUser.accessLevel == "admin"
                                ? filterCompanies.map((company: ICompany) => {
                                    return (
                                        <div key={company.id} className={savedTheme == "light" ? styles.dataLight : styles.dataDark}>
                                            <div className={styles.cardTop}>
                                                <p>Id: {company.id}</p>
                                                <button onClick={() => { setCompanyBeingEdited(company); setIsCompanyModalOpen(true) }}>
                                                    <img src={savedTheme == "light" ? editLight : editDark} alt="" />
                                                </button>
                                            </div>
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
                        <ModalCompany isCompanyModalOpen={isCompanyModalOpen}
                            setIsCompanyModalOpen={setIsCompanyModalOpen}
                            companyBeingEdited={companyBeingEdited}
                            setCompanyBeingEdited={setCompanyBeingEdited}
                            savedTheme={savedTheme}
                        />
                    </div>
                }[showedComponent]
            }
        </div>
    )
}