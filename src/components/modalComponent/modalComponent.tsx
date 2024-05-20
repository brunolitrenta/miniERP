import styles from "./modalComponent.module.scss"
import xmark from "../../assets/xmark-white.svg"

interface IProps {
    isOpen: boolean

    close: () => void
}

export function Modal(props: IProps) {

    const savedTheme = localStorage.getItem("theme")

    const currentUser = JSON.parse(sessionStorage.getItem("loggedUser") || "[]")

    const users = JSON.parse(localStorage.getItem("users") || "[]")

    if (props.isOpen) {
        return (
            <div className={styles.overlay}>
                <div className={savedTheme == "light" ? styles.addSectionLight : styles.addSectionDark}>
                    <div className={styles.topTab}>
                        <div className={styles.setField}>
                            <p className={styles.label}>Id: </p>
                            <p className={styles.data}>{users.length + 1}</p>
                        </div>
                        <button className={styles.closeButton} onClick={() => props.close()}><img src={xmark}></img></button>
                    </div>
                    <div className={styles.formField}>
                        <label htmlFor="nameInpt">Name</label>
                        <input id="nameInpt" type="text" />
                    </div>
                    <div className={styles.formField}>
                        <label htmlFor="emailInpt">Email</label>
                        <input id="emailInpt" type="email" />
                    </div>
                    <div className={styles.formField}>
                        <label htmlFor="passwordInpt">Password</label>
                        <input id="passwordInpt" type="text" />
                    </div>
                    <div className={styles.formField}>
                        <p className={styles.label}>Access Level</p>
                        <div className={styles.radioSection}>
                            <label htmlFor="admRadio">Admin</label>
                            <input type="radio" name="accessLevel" id="admRadio" value="admin" />
                            <label htmlFor="mngRadio">Manager</label>
                            <input type="radio" name="accessLevel" id="mngRadio" value="manager" />
                            <label htmlFor="empRadio">Employee</label>
                            <input type="radio" name="accessLevel" id="empRadio" value="employee" />
                        </div>
                    </div>
                    <div className={styles.setField}>
                        <p className={styles.label}>Company ID: </p>
                        <p className={styles.data}>{currentUser.companyId}</p>
                    </div>
                    <button className={styles.addButton}>Add</button>
                </div>
            </div>
        )
    }

    return null
}