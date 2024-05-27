import { useEffect, useState } from "react"
import styles from "./homePage.module.scss"
import { Data } from "../../components/dataComponent/dataComponent"
import { Product } from "../../components/productComponent/productComponent"
import { useNavigate } from "react-router-dom"
import { useCurrentUserContext } from "../../hooks/currentUserContext"

export function HomePage() {

    const {currentUser} = useCurrentUserContext()

    const navigate = useNavigate()

    const savedTheme = localStorage.getItem("theme")

    const isAuthenticated = sessionStorage.getItem("isAuthenticated")

    const [showedComponent, setShowedComponent] = useState<number>(1)

    useEffect(() => {
        document.title = "Home"
        if (isAuthenticated != "true") {
            navigate("/")
        }
    }, [])

    return (
        <div className={savedTheme == "light" ? styles.light : styles.dark}>
            <h3>Welcome, {currentUser.name}</h3>
            <nav className={styles.navMenu}>
                <button className={showedComponent == 1 ? styles.activeNavButton : styles.inactiveNavButton} onClick={() => setShowedComponent(1)}>Data</button>
                <button className={showedComponent == 2 ? styles.activeNavButton : styles.inactiveNavButton} onClick={() => setShowedComponent(2)}>Products</button>
            </nav>
            {
                {
                    1:<Data />,

                    2: <Product />
                }[showedComponent]
            }
        </div>
    )
}