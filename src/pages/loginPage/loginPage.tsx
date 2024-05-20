import { useEffect, useRef, useState } from "react"
import styles from "./loginPage.module.scss"
import lightImage from "../../assets/moon-solid.svg"
import darkImage from "../../assets/sun-regular.svg"
import eyeLight from "../../assets/eye-black.svg"
import eyeSlashedLight from "../../assets/eye-slash-black.svg"
import eyeDark from "../../assets/eye-white.svg"
import eyeSlashedDark from "../../assets/eye-slash-white.svg"
import { useNavigate } from "react-router-dom"
import { IUser } from "../../Interfaces/IUser"

export function LoginPage() {

    const users: Array<IUser> = JSON.parse(localStorage.getItem("users") || "[]")

    const navigate = useNavigate()

    const savedTheme = localStorage.getItem("theme")

    const [showPassword, setShowPassword] = useState<boolean>(true)

    const [selectedTheme, setSelectedTheme] = useState<string>("dark")

    const [themeButtonImage, setThemeButtonImage] = useState<string>(darkImage)

    const [showPasswordButtonImage, setShowPasswordButtonImage] = useState<string>(eyeDark)

    const inputRef = useRef<HTMLInputElement>(null)

    const passwordRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        document.title = "Sign In"
        setThemeAtStartup()
    }, [])

    function setThemeAtStartup() {
        if (savedTheme == "light") {
            setSelectedTheme("light")
            setThemeButtonImage(lightImage)
            setShowPasswordButtonImage(eyeLight)
        }
    }

    function setTheme() {
        if (selectedTheme == "dark" && !showPassword) {
            setSelectedTheme("light")
            setThemeButtonImage(lightImage)
            setShowPasswordButtonImage(eyeSlashedLight)
            localStorage.setItem("theme", "light")
            return
        }
        else if (selectedTheme == "dark" && showPassword == true) {
            setSelectedTheme("light")
            setThemeButtonImage(lightImage)
            setShowPasswordButtonImage(eyeLight)
            localStorage.setItem("theme", "light")
            return
        }
        else if (selectedTheme == "light" && !showPassword) {
            setSelectedTheme("dark")
            setThemeButtonImage(darkImage)
            setShowPasswordButtonImage(eyeSlashedDark)
            localStorage.removeItem("theme")
            return
        }
        else {
            setSelectedTheme("dark")
            setThemeButtonImage(darkImage)
            setShowPasswordButtonImage(eyeDark)
            localStorage.removeItem("theme")
        }
    }

    function setShowPass() {
        if (showPassword && selectedTheme == "dark") {
            setShowPassword(!showPassword)
            setShowPasswordButtonImage(eyeSlashedDark)
            return
        }
        else if (!showPassword && selectedTheme == "dark") {
            setShowPassword(!showPassword)
            setShowPasswordButtonImage(eyeDark)
            return
        }
        else if (showPassword && selectedTheme == "light") {
            setShowPassword(!showPassword)
            setShowPasswordButtonImage(eyeSlashedLight)
            return
        }
        else {
            setShowPassword(!showPassword)
            setShowPasswordButtonImage(eyeLight)
        }
    }

    function handleLogin() {
        const correctUser = users.find(users => users.email == inputRef.current!.value || users.name == inputRef.current!.value)
        if (correctUser && correctUser.password == passwordRef.current!.value && correctUser.active) {
            sessionStorage.setItem("isAuthenticated", "true")
            sessionStorage.setItem("loggedUser", JSON.stringify(correctUser))
            navigate("/home")
        }
        else {
            window.alert("Incorrect username or password. Try again.")
        }
    }

    return (
        <div className={selectedTheme == "dark" ? styles.dark : styles.light}>
            <button className={styles.themeButton} onClick={() => { setTheme() }}><img src={themeButtonImage}></img></button>
            <h1>Sign-In</h1>
            <div className={styles.loginBox}>
                <div className={styles.userInput}>
                    <label htmlFor="username">Username or E-mail</label>
                    <input id="username" type="email" ref={inputRef} />
                </div>
                <div className={styles.passInput}>
                    <label htmlFor="password">Password</label>
                    <div className={styles.passButton}>
                        {
                            !showPassword
                                ? <input ref={passwordRef} id="password" type="text" />
                                : <input ref={passwordRef} id="password" type="password" />
                        }
                        <button className={styles.showPass} onClick={() => { setShowPass() }}><img src={showPasswordButtonImage}></img></button>
                    </div>
                </div>
                <button className={styles.loginButton} onClick={() => handleLogin()}>Login</button>
            </div>
        </div>
    )
}