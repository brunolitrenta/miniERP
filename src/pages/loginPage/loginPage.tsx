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
import { ICompany } from "../../Interfaces/ICompany"

export function LoginPage() {

    const [users, setUsers] = useState<Array<IUser>>(JSON.parse(localStorage.getItem("users") || "[]"))

    const [companies, setCompanies] = useState<Array<ICompany>>(JSON.parse(localStorage.getItem("companies") || "[]"))

    const navigate = useNavigate()

    const savedTheme = localStorage.getItem("theme")

    const [showPassword, setShowPassword] = useState<boolean>(true)

    const [isRegistering, setIsRegistering] = useState<boolean>(false)

    const [selectedTheme, setSelectedTheme] = useState<string>("dark")

    const [themeButtonImage, setThemeButtonImage] = useState<string>(darkImage)

    const [showPasswordButtonImage, setShowPasswordButtonImage] = useState<string>(eyeDark)

    const nameRef = useRef<HTMLInputElement>(null)

    const emailRef = useRef<HTMLInputElement>(null)

    const inputRef = useRef<HTMLInputElement>(null)

    const passwordRef = useRef<HTMLInputElement>(null)

    const confirmPasswordRef = useRef<HTMLInputElement>(null)

    const companyNameRef = useRef<HTMLInputElement>(null)

    const cnpjRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        document.title = "Sign In"
        setThemeAtStartup()
    }, [])

    useEffect(() => {
        localStorage.setItem("users", JSON.stringify(users))
    }, [users])

    useEffect(() => {
        localStorage.setItem("companies", JSON.stringify(companies))
    }, [companies])

    function setThemeAtStartup() {
        if (savedTheme == "light") {
            setSelectedTheme("light")
            setThemeButtonImage(lightImage)
            setShowPasswordButtonImage(eyeLight)
        }
    }

    function setTheme() {

        setSelectedTheme(selectedTheme == "light" ? "dark" : "light")
        setThemeButtonImage(selectedTheme == "light" ? darkImage : lightImage)
        setShowPasswordButtonImage(!showPassword ? (selectedTheme == "light" ? eyeSlashedDark : eyeSlashedLight) : (selectedTheme == "light" ? eyeDark : eyeLight))

        if(selectedTheme == "dark"){
            localStorage.setItem("theme", "light")
        }
        else{
            localStorage.removeItem("theme")
        }
        return

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

    function registerData() {

        if (companyNameRef.current == null || cnpjRef.current == null || nameRef.current == null || emailRef.current == null || passwordRef.current == null || confirmPasswordRef.current == null) return

        if (companyNameRef.current.value == "" || cnpjRef.current.value == "" || nameRef.current.value == "" || emailRef.current.value == "" || passwordRef.current.value == "" || confirmPasswordRef.current.value == "") {
            window.alert("All fields must be filled!")
            return
        }

        const registerCompany: ICompany = {
            id: companies.length == 0 ? 1 : companies.sort((a: ICompany, b: ICompany) => a.id > b.id ? -1 : 1)[0].id + 1,
            companyName: companyNameRef.current.value,
            CNPJ: cnpjRef.current.value,
            active: true
        }

        setCompanies(prevState => [...prevState, registerCompany])

        const registerUser: IUser = {
            id: users.length == 0 ? 1 : users.sort((a: IUser, b: IUser) => a.id > b.id ? -1 : 1)[0].id + 1,
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value == confirmPasswordRef.current.value ? passwordRef.current.value : "",
            accessLevel: "admin",
            companyId: registerCompany.id,
            active: true
        }

        if (passwordRef.current.value != confirmPasswordRef.current.value) {
            window.alert("Passwords don't match.")
            return
        }

        setUsers(prevState => [...prevState, registerUser])

        window.alert("Data registered succesfully.")

        setIsRegistering(false)

        return
    }

    return (
        <div className={selectedTheme == "dark" ? styles.dark : styles.light}>
            <button className={styles.themeButton} onClick={() => { setTheme() }}><img src={themeButtonImage}></img></button>
            <h1>mini-ERP</h1>
            <nav>
                <button className={isRegistering ? styles.buttonInactive : styles.buttonActive} onClick={() => setIsRegistering(false)}>Sign In</button>
                <button className={isRegistering ? styles.buttonActive : styles.buttonInactive} onClick={() => setIsRegistering(true)}>Sign Up</button>
            </nav>
            {
                !isRegistering
                    ? <div className={styles.loginBox}>
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
                    : <div className={styles.registerBox}>
                        <div className={styles.userInput}>
                            <label htmlFor="username">Username</label>
                            <input id="username" type="text" ref={nameRef} />
                        </div>
                        <div className={styles.userInput}>
                            <label htmlFor="email">Email</label>
                            <input id="email" type="email" ref={emailRef} />
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
                        <div className={styles.passInput}>
                            <label htmlFor="confirmpassword">Confirm password</label>
                            <div className={styles.passButton}>
                                {
                                    !showPassword
                                        ? <input ref={confirmPasswordRef} id="confirmpassword" type="text" />
                                        : <input ref={confirmPasswordRef} id="confirmpassword" type="password" />
                                }
                                <button className={styles.showPass} onClick={() => { setShowPass() }}><img src={showPasswordButtonImage}></img></button>
                            </div>
                        </div>
                        <div className={styles.userInput}>
                            <label htmlFor="company">Company</label>
                            <input id="company" type="text" ref={companyNameRef} />
                        </div>
                        <div className={styles.userInput}>
                            <label htmlFor="cnpj">CNPJ</label>
                            <input id="cnpj" type="text" ref={cnpjRef} />
                        </div>
                        <button className={styles.registerButton} onClick={() => registerData()}>Sign Up</button>
                    </div>
            }
        </div>
    )
}