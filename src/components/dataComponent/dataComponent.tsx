import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { IUser } from "../../Interfaces/IUser"
import styles from "./dataComponent.module.scss"
import { ICompany } from "../../Interfaces/ICompany"
import { Modal } from "../modalComponent/modalComponent"
import plus from "../../assets/plus-solid.svg"
import editDark from "../../assets/pen-to-square-white.svg"
import editLight from "../../assets/pen-to-square-solid.svg"
import trash from "../../assets/trash.svg"
import xmark from "../../assets/xmark-white.svg"

interface IModalContentProps {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    setUserBeingEdited: Dispatch<SetStateAction<IUser | null>>,
    accessLevelInput: string,
    setAccessLevelInput: Dispatch<SetStateAction<string>>
    users: Array<IUser>,
    currentUser: number,
    userBeingEdited: IUser | null,
    savedTheme: string | null,
    setUsers: Dispatch<SetStateAction<Array<IUser>>>
}

const ModalContent = ({ isOpen, setIsOpen, userBeingEdited, setUserBeingEdited, users, currentUser, savedTheme, accessLevelInput, setAccessLevelInput, setUsers }: IModalContentProps) => {
    const nameInput = useRef<HTMLInputElement>(null)

    const emailInput = useRef<HTMLInputElement>(null)

    const passwordInput = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!nameInput.current || !emailInput.current || !passwordInput.current) return

        if (!userBeingEdited) {
            nameInput.current.value = ""
            emailInput.current.value = ""
            passwordInput.current.value = ""
            return
        }

        nameInput.current.value = userBeingEdited.name
        emailInput.current.value = userBeingEdited.email
        passwordInput.current.value = userBeingEdited.password
        const accessLevelElement: any = document.getElementById(userBeingEdited.accessLevel)
        accessLevelElement.checked = true

    }, [userBeingEdited])

    function addNewUser() {

        const newUser: IUser = {
            id: users.sort((a: IUser, b: IUser) => a.id > b.id ? -1 : 1)[0].id + 1,
            name: nameInput.current!.value,
            email: emailInput.current!.value,
            password: passwordInput.current!.value,
            accessLevel: accessLevelInput,
            companyId: currentUser,
            active: true
        }

        setUsers(prevUsers => [...prevUsers, newUser])
        setIsOpen(!isOpen)
    }

    function editUser() {

        const updatedUser: IUser = {
            id: userBeingEdited!.id,
            name: nameInput.current!.value,
            email: emailInput.current!.value,
            password: passwordInput.current!.value,
            accessLevel: accessLevelInput,
            companyId: currentUser,
            active: userBeingEdited!.active
        }

        setUsers(() => {
            const excludeOldUser = users.filter((ps) => ps.id != userBeingEdited!.id)
            return [...excludeOldUser, updatedUser]
        })

        setUserBeingEdited(null)
    }

    function deleteUser(userBeingEdited: IUser | undefined) {
        const removeUser = users.filter((u) => u.id != userBeingEdited!.id)

        setUsers(removeUser)
        setUserBeingEdited(null)
    }

    return (
        <Modal isOpen={isOpen} close={() => { setUserBeingEdited(null); setIsOpen(!isOpen) }}>
            <div className={savedTheme == "light" ? styles.addSectionLight : styles.addSectionDark}>
                <div className={styles.topTab}>
                    <div className={styles.setField}>
                        <p className={styles.label}>Id: </p>
                        <p className={styles.data}>{!!userBeingEdited ? userBeingEdited?.id : users.sort((a: IUser, b: IUser) => a.id > b.id ? -1 : 1)[0].id + 1}</p>
                    </div>
                    <button className={styles.closeButton} onClick={() => { setUserBeingEdited(null); setIsOpen(false) }}>
                        <img src={xmark} alt="" />
                    </button>
                </div>
                <div className={styles.formField}>
                    <label htmlFor="nameInpt">Name</label>
                    <input ref={nameInput} id="nameInpt" type="text" />
                </div>
                <div className={styles.formField}>
                    <label htmlFor="emailInpt">Email</label>
                    <input ref={emailInput} id="emailInpt" type="email" />
                </div>
                <div className={styles.formField}>
                    <label htmlFor="passwordInpt">Password</label>
                    <input ref={passwordInput} id="passwordInpt" type="text" />
                </div>
                <div className={styles.formField}>
                    <p className={styles.label}>Access Level</p>
                    <div className={styles.radioSection}>
                        <div className={styles.radioInputs}>
                            <label htmlFor="admin">Admin</label>
                            <input type="radio"
                                name="accessLevel"
                                id="admin"
                                value="admin"
                                onChange={() => setAccessLevelInput("admin")}
                            />
                        </div>
                        <div className={styles.radioInputs}>
                            <label htmlFor="manager">Manager</label>
                            <input type="radio"
                                name="accessLevel"
                                id="manager"
                                value="manager"
                                onChange={() => setAccessLevelInput("manager")}
                            />
                        </div>
                        <div className={styles.radioInputs}>
                            <label htmlFor="employee">Employee</label>
                            <input type="radio"
                                name="accessLevel"
                                id="employee"
                                value="employee"
                                onChange={() => setAccessLevelInput("employee")}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.setField}>
                    <p className={styles.label}>Company ID: </p>
                    <p className={styles.data}>{currentUser}</p>
                </div>
                {
                    userBeingEdited != null
                        ? <div className={styles.editButtons}>
                            <button className={styles.removeButton} onClick={() => { deleteUser(userBeingEdited); setIsOpen(false) }}>
                                <img src={trash} alt="" />
                            </button>
                            <button className={styles.saveUserButton} onClick={() => { editUser(); setIsOpen(false) }}>Save</button>
                        </div>
                        : <button className={styles.addUserButton} onClick={() => addNewUser()}>Add</button>
                }
            </div>
        </Modal>
    )
}

export function Data() {

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const [accessLevelInput, setAccessLevelInput] = useState<string>("")

    const [userBeingEdited, setUserBeingEdited] = useState<IUser | null>(null)

    const [filterUsers, setFilterUsers] = useState<Array<IUser>>([])

    const [users, setUsers] = useState<Array<IUser>>(JSON.parse(localStorage.getItem("users") || "[]"))

    const [filterCompanies, setFilterCompanies] = useState<Array<ICompany>>([])

    const [showedComponent, setShowedComponent] = useState<number>(0)

    const savedTheme = localStorage.getItem("theme")

    const currentUser: IUser = JSON.parse(sessionStorage.getItem("loggedUser") || "[]")

    const companies: Array<ICompany> = (JSON.parse(localStorage.getItem("companies") || "[]"))

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
                                            <div className={styles.cardTop}>
                                                <p>Id: {user.id}</p>
                                                <button onClick={() => { setUserBeingEdited(user); setIsOpen(true) }}>
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
                        <button className={styles.addButton} onClick={() => { setIsOpen(true) }}>
                            <img src={plus}></img>
                        </button>
                        <ModalContent isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            userBeingEdited={userBeingEdited}
                            setUserBeingEdited={setUserBeingEdited}
                            accessLevelInput={accessLevelInput}
                            setAccessLevelInput={setAccessLevelInput}
                            users={users}
                            currentUser={currentUser.companyId}
                            savedTheme={savedTheme}
                            setUsers={setUsers}
                        />
                    </div>,
                    2: <div className={styles.grid}>
                        {
                            currentUser.accessLevel == "admin"
                                ? filterCompanies.sort((a: ICompany, b: ICompany) => a.id > b.id ? -1 : 1).map((company: ICompany) => {
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
                    </div>
                }[showedComponent]
            }
        </div>
    )
}