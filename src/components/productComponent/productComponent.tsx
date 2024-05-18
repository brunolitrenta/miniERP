import { useState } from "react"
import { IProducts } from "../../Interfaces/IProducts"
import styles from "./productComponent.module.scss"

export function Product() {

    const savedTheme = localStorage.getItem("theme")

    const accessLevel = sessionStorage.getItem("accessLevel")

    const [products, setProducts] = useState<Array<IProducts>>(JSON.parse(localStorage.getItem("products") || "[]"))

    function activateProduct(product: IProducts) {
        setProducts(prevState => {
            const newArr = prevState.filter((ps) => ps.id != product.id)
            const _product = { ...product, active: !product.active }
            return [...newArr, _product]
        })
    }

    return (
        <div className={savedTheme == "light" ? styles.light : styles.dark}>
            <div className={styles.grid}>
                {
                    accessLevel == "admin"
                        ? products.sort(function sortArray(a: IProducts, b: IProducts) {
                            if (a.id < b.id) {
                                return -1
                            }
                            if (a.id > b.id) {
                                return 1
                            }
                            return 0
                        }).map((product: IProducts) => {
                            return (
                                <div key={product.id} className={savedTheme == "light" ? styles.dataLight : styles.dataDark}>
                                    <p>Id: {product.id}</p>
                                    <p>Name: {product.name}</p>
                                    <p>Quantity: {product.quantity}</p>
                                    <p>Price: {product.price}</p>
                                    <div className={styles.activeSection}>
                                        <p>Active: {product.active ? "true" : "false"}</p>
                                        <button className={!product.active ? styles.buttonActive : styles.buttonInactive} onClick={() => activateProduct(product)}>
                                            {product.active ? "Deactivate" : "Activate"}
                                        </button>
                                    </div>
                                    <p>Deleted: {product.deleted ? "true" : "false"}</p>
                                    <p>Created at: {product.createdAt}</p>
                                    <p>Updated at: {product.updatedAt}</p>
                                    <p>Company Id: {product.companyId}</p>
                                </div>
                            )
                        })
                        : products.sort().map((product: IProducts) => {
                            return (
                                <div key={product.id} className={savedTheme == "light" ? styles.dataLight : styles.dataDark}>
                                    <p>Id: {product.id}</p>
                                    <p>Name: {product.name}</p>
                                    <p>Quantity: {product.quantity}</p>
                                    <p>Price: {product.price}</p>
                                    <p>Active: {product.active ? "true" : "false"}</p>
                                    <p>Deleted: {product.deleted ? "true" : "false"}</p>
                                    <p>Created at: {product.createdAt}</p>
                                    <p>Updated at: {product.updatedAt}</p>
                                    <p>Company Id: {product.companyId}</p>
                                </div>
                            )
                        })
                }
            </div>
        </div>
    )
}