import { ReactNode } from "react"
import styles from "./modalComponent.module.scss"

interface IProps {
    isOpen: boolean
    close: () => void

    children: ReactNode
}

export function Modal({ isOpen, close, children }: IProps) {

    if (isOpen) {
        return (
            <div className={styles.pai}>
                <div className={styles.overlay} onClick={close}>
                </div>
                <div className={styles.modalContent}>
                    {children}
                </div>
            </div>
        )
    }

    return null

}