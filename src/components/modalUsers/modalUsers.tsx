import { Dispatch, SetStateAction, useEffect, useRef } from "react"
import { IUser } from "../../Interfaces/IUser"
import { Modal } from "../modalComponent/modalComponent"
import trash from "../../assets/trash.svg"
import xmark from "../../assets/xmark-white.svg"
import styles from "./modalUsers.module.scss"

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


export function ModalUsers({ isOpen, setIsOpen, userBeingEdited, setUserBeingEdited, users, currentUser, savedTheme, accessLevelInput, setAccessLevelInput, setUsers }: IModalContentProps) {
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