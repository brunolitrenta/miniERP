import { useEffect, useState } from "react"
import styles from "./homePage.module.scss"
import { Data } from "../../components/dataComponent/dataComponent"
import { Product } from "../../components/productComponent/productComponent"
import { useNavigate } from "react-router-dom"

export function HomePage() {

    const navigate = useNavigate()

    const currentUser = sessionStorage.getItem("currentUsername")

    const savedTheme = localStorage.getItem("theme")

    const isAuthenticated = sessionStorage.getItem("isAuthenticated")

    const [showedComponent, setShowedComponent] = useState<number>(0)

    useEffect(() => {
        document.title = "Home"
        if (isAuthenticated != "true") {
            navigate("/")
        }
    }, [])

    return (
        <div className={savedTheme == "light" ? styles.light : styles.dark}>
            <h3>Welcome, {currentUser}</h3>
            <nav className={styles.navMenu}>
                <button className={styles.navButton} onClick={() => setShowedComponent(1)}>Data</button>
                <button className={styles.navButton} onClick={() => setShowedComponent(2)}>Products</button>
            </nav>
            {
                {
                    1: <Data />,

                    2: <Product />
                }[showedComponent]
            }
        </div>
    )
}