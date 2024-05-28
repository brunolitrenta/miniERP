import { useEffect, useState } from "react"
import { IProducts } from "../../Interfaces/IProducts"
import styles from "./productComponent.module.scss"
import plus from "../../assets/plus-solid.svg"
import { ModalProduct } from "../modalProduct/modalProduct"
import editLight from "../../assets/pen-to-square-solid.svg"
import editDark from "../../assets/pen-to-square-white.svg"
import { useCurrentUserContext } from "../../hooks/currentUserContext"

export function Product() {

    const { currentUser } = useCurrentUserContext()

    const [products, setProducts] = useState<Array<IProducts>>(JSON.parse(localStorage.getItem("products") || "[]"))

    const [filterProducts, setFilterProducts] = useState<Array<IProducts>>([])

    const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false)

    const [productBeingEdited, setProductBeingEdited] = useState<IProducts | null>(null)

    const savedTheme = localStorage.getItem("theme")

    useEffect(() => {
        localStorage.setItem("products", JSON.stringify(products))
        filter()
    }, [products])

    function activateProduct(product: IProducts) {
        setProducts(prevState => {
            const newArr = prevState.filter((ps) => ps.id != product.id)
            const _product = { ...product, active: !product.active }
            return [...newArr, _product]
        })
    }

    function filter() {
        setFilterProducts(() => {
            const newArr = products.filter((ps) => ps.companyId == currentUser.companyId)
            return [...newArr]
        })
    }

    return (
        <div className={savedTheme == "light" ? styles.light : styles.dark}>
            <div className={styles.grid}>
                {
                    currentUser.accessLevel == "admin" || currentUser.accessLevel == "manager"
                        ? filterProducts.sort((a: IProducts, b: IProducts) => a.id < b.id ? -1 : 1).map((product: IProducts) => {
                            return (
                                <div key={product.id} className={savedTheme == "light" ? styles.dataLight : styles.dataDark}>
                                    <div className={styles.cardTop}>
                                        <p>Id: {product.id}</p>
                                        <button onClick={() => { setProductBeingEdited(product); setIsProductModalOpen(true) }}>
                                            <img src={savedTheme == "light" ? editLight : editDark} alt="" />
                                        </button>
                                    </div>
                                    <p>Name: {product.name}</p>
                                    <p>Quantity: {product.quantity}</p>
                                    <p>Price: {product.price}</p>
                                    <div className={styles.activeSection}>
                                        <p>Active: {product.active ? "true" : "false"}</p>
                                        <button className={!product.active ? styles.buttonActive : styles.buttonInactive} onClick={() => activateProduct(product)}>
                                            {product.active ? "Deactivate" : "Activate"}
                                        </button>
                                    </div>
                                    <p>Created at: {product.createdAt}</p>
                                    <p>Updated at: {product.updatedAt}</p>
                                    <p>Company Id: {product.companyId}</p>
                                </div>
                            )
                        })
                        : filterProducts.sort((a: IProducts, b: IProducts) => a.id < b.id ? -1 : 1).map((product: IProducts) => {
                            return (
                                <div key={product.id} className={savedTheme == "light" ? styles.dataLight : styles.dataDark}>
                                    <p>Id: {product.id}</p>
                                    <p>Name: {product.name}</p>
                                    <p>Quantity: {product.quantity}</p>
                                    <p>Price: {product.price}</p>
                                    <p>Active: {product.active ? "true" : "false"}</p>
                                    <p>Created at: {product.createdAt}</p>
                                    <p>Updated at: {product.updatedAt}</p>
                                    <p>Company Id: {product.companyId}</p>
                                </div>
                            )
                        })
                }
                <ModalProduct isProductModalOpen={isProductModalOpen}
                    setIsProductModalOpen={setIsProductModalOpen}
                    productBeingEdited={productBeingEdited}
                    setProductBeingEdited={setProductBeingEdited}
                    products={products}
                    setProducts={setProducts}
                    savedTheme={savedTheme}
                />
            </div>
            {
                currentUser.accessLevel == "admin" || currentUser.accessLevel == "manager"
                    ? <button className={styles.addButton} onClick={() => { setIsProductModalOpen(true) }}>
                        <img src={plus}></img>
                    </button>
                    : null
            }
        </div>
    )
}