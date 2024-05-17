import { useEffect, useState } from "react"
import { IUser } from "../../Interfaces/IUser"
import styles from "./dataComponent.module.scss"

export function Data() {

    const savedTheme = localStorage.getItem("theme")

    const accessLevel = sessionStorage.getItem("accessLevel")

    const [users, setUsers] = useState<Array<IUser>>(JSON.parse(localStorage.getItem("users") || "[]"))

    // const companies = [
    //     {
    //         "id": 1,
    //         "companyName": "PegaAQuitanda",
    //         "CNPJ": "35.378.136/0001-14",
    //         "active": true
    //     },
    //     {
    //         "id": 2,
    //         "companyName": "MercadinCria",
    //         "CNPJ": "15.098.992/0001-09",
    //         "active": true
    //     }
    // ]

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


    return (
        <div className={styles.grid}>
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
        </div>
    )
}