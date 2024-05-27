import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { IUser } from "../../Interfaces/IUser"
import { Modal } from "../modalComponent/modalComponent"
import trash from "../../assets/trash.svg"
import xmark from "../../assets/xmark-white.svg"
import styles from "./modalUsers.module.scss"
import { useData } from "../../hooks/dataContext"
import { useCurrentUserContext } from "../../hooks/currentUserContext"

interface IModalContentProps {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    setUserBeingEdited: Dispatch<SetStateAction<IUser | null>>,
    userBeingEdited: IUser | null,
    savedTheme: string | null,
}


export function ModalUsers({ isOpen, setIsOpen, userBeingEdited, setUserBeingEdited, savedTheme }: IModalContentProps) {

    const { users, setUsers } = useData()

    const { currentUser } = useCurrentUserContext()

    const [accessLevelInput, setAccessLevelInput] = useState<string | undefined>(undefined)

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
        setAccessLevelInput(userBeingEdited.accessLevel)

    }, [userBeingEdited])

    useEffect(() => {
        setAccessLevelInput(undefined)
    }, [users])

    function addNewUser() {

        if (!nameInput.current || !emailInput.current || !passwordInput.current) return

        if (nameInput.current.value == "" || emailInput.current.value == "" || passwordInput.current.value == "" || !accessLevelInput) {
            window.alert("All fields must be filled!")
            return
        }

        const foundName = users.find(us => us.name == nameInput.current!.value)

        const foundEmail = users.find(us => us.email == emailInput.current!.value)

        if (foundName && foundEmail) {
            window.alert("This username and email has already been registered")
            return
        }
        else if (foundEmail && !foundName) {
            window.alert("This email has already been registered")
            return
        }
        else if (foundName && !foundEmail) {
            window.alert("This username has already been registered")
            return
        }

        const newUser: IUser = {
            id: users.sort((a: IUser, b: IUser) => a.id > b.id ? -1 : 1)[0].id + 1,
            name: nameInput.current.value,
            email: emailInput.current.value,
            password: passwordInput.current.value,
            accessLevel: accessLevelInput!,
            companyId: currentUser.companyId,
            active: true
        }

        setUsers(prevUsers => [...prevUsers, newUser])
        setIsOpen(false)
    }

    function editUser() {

        if (!nameInput.current || !emailInput.current || !passwordInput.current) return

        if (nameInput.current.value == "" || emailInput.current.value == "" || passwordInput.current.value == "" || !accessLevelInput) {
            window.alert("All fields must be filled!")
            return
        }

        const foundName = users.find(us => us.name == nameInput.current!.value && us.id != userBeingEdited!.id)

        const foundEmail = users.find(us => us.email == emailInput.current!.value && us.id != userBeingEdited!.id)

        if (foundName && foundEmail) {
            window.alert("This username and email are already registered")
            return
        }
        else if (foundEmail && !foundName) {
            window.alert("This email is already registered")
            return
        }
        else if (foundName && !foundEmail) {
            window.alert("This username is already registered")
            return
        }

        const updatedUser: IUser = {
            id: userBeingEdited!.id,
            name: nameInput.current.value,
            email: emailInput.current.value,
            password: passwordInput.current.value,
            accessLevel: accessLevelInput!,
            companyId: currentUser.companyId,
            active: userBeingEdited!.active
        }

        setUsers(() => {
            const excludeOldUser = users.filter((ps) => ps.id != userBeingEdited!.id)
            return [...excludeOldUser, updatedUser]
        })

        setUserBeingEdited(null)
        setIsOpen(false)
    }

    function deleteUser(userBeingEdited: IUser | undefined) {
        const removeUser = users.filter((u) => u.id != userBeingEdited!.id)

        setUsers(removeUser)
        setUserBeingEdited(null)
        setIsOpen(false)
    }

    return (
        <Modal isOpen={isOpen} close={() => { setUserBeingEdited(null); setAccessLevelInput(undefined); setIsOpen(false) }}>
            <div className={savedTheme == "light" ? styles.addSectionLight : styles.addSectionDark}>
                <div className={styles.topTab}>
                    <div className={styles.setField}>
                        <p className={styles.label}>Id: </p>
                        <p className={styles.data}>{!!userBeingEdited ? userBeingEdited?.id : users.sort((a: IUser, b: IUser) => a.id > b.id ? -1 : 1)[0].id + 1}</p>
                    </div>
                    <button className={styles.closeButton} onClick={() => { setUserBeingEdited(null); setAccessLevelInput(undefined); setIsOpen(false) }}>
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
                                checked={accessLevelInput == "admin" ? true : false}
                            />
                        </div>
                        <div className={styles.radioInputs}>
                            <label htmlFor="manager">Manager</label>
                            <input type="radio"
                                name="accessLevel"
                                id="manager"
                                value="manager"
                                onChange={() => setAccessLevelInput("manager")}
                                checked={accessLevelInput == "manager" ? true : false}
                            />
                        </div>
                        <div className={styles.radioInputs}>
                            <label htmlFor="employee">Employee</label>
                            <input type="radio"
                                name="accessLevel"
                                id="employee"
                                value="employee"
                                onChange={() => setAccessLevelInput("employee")}
                                checked={accessLevelInput == "employee" ? true : false}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.setField}>
                    <p className={styles.label}>Company ID: </p>
                    <p className={styles.data}>{currentUser.companyId}</p>
                </div>
                {
                    userBeingEdited != null
                        ? <div className={styles.editButtons}>
                            <button className={styles.removeButton} onClick={() => { deleteUser(userBeingEdited) }}>
                                <img src={trash} alt="" />
                            </button>
                            <button className={styles.saveUserButton} onClick={() => { editUser() }}>Save</button>
                        </div>
                        : <button className={styles.addUserButton} onClick={() => addNewUser()}>Add</button>
                }
            </div>
        </Modal>
    )
}