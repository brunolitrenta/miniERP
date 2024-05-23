import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { IProducts } from "../../Interfaces/IProducts";
import { Modal } from "../modalComponent/modalComponent";
import styles from "./modalProduct.module.scss"
import xmark from "../../assets/xmark-white.svg"
import trash from "../../assets/trash.svg"
import { IUser } from "../../Interfaces/IUser";

interface IProductContentProps {
    isProductModalOpen: boolean,
    setIsProductModalOpen: Dispatch<SetStateAction<boolean>>,
    productBeingEdited: IProducts | null,
    setProductBeingEdited: Dispatch<SetStateAction<IProducts | null>>,
    products: Array<IProducts>,
    setProducts: Dispatch<SetStateAction<Array<IProducts>>>,
    savedTheme: string | null,
    currentUser: IUser
}

export function ModalProduct({ isProductModalOpen, setIsProductModalOpen, productBeingEdited, setProductBeingEdited, products, setProducts, savedTheme, currentUser }: IProductContentProps) {

    const nameInput = useRef<HTMLInputElement>(null)

    const quantityInput = useRef<HTMLInputElement>(null)

    const priceInput = useRef<HTMLInputElement>(null)

    const date = new Date().toLocaleDateString()

    useEffect(() => {
        if (!nameInput.current || !quantityInput.current || !priceInput.current) return

        if (!productBeingEdited) {
            nameInput.current.value = ""
            quantityInput.current.value = ""
            priceInput.current.value = ""
            return
        }

        nameInput.current.value = productBeingEdited.name
        quantityInput.current.value = JSON.stringify(productBeingEdited.quantity)
        priceInput.current.value = JSON.stringify(productBeingEdited.price)

    }, [productBeingEdited])

    function addNewProduct() {

        const newProduct: IProducts = {
            id: products.length == 0 ? 1 :products.sort((a: IProducts, b: IProducts) => a.id > b.id ? -1 : 1)[0].id + 1,
            name: nameInput.current!.value,
            quantity: JSON.parse(quantityInput.current!.value),
            price: JSON.parse(priceInput.current!.value),
            active: true,
            createdAt: date,
            updatedAt: "never",
            companyId: currentUser.companyId
        }

        setProducts(prevProducts => [...prevProducts, newProduct])
        setIsProductModalOpen(false)
    }

    function editProduct() {
        const updatedProduct: IProducts = {
            id: productBeingEdited!.id,
            name: nameInput.current!.value,
            quantity: JSON.parse(quantityInput.current!.value),
            price: JSON.parse(priceInput.current!.value),
            active: productBeingEdited!.active,
            createdAt: productBeingEdited!.createdAt,
            updatedAt: date,
            companyId: productBeingEdited!.companyId
        }

        setProducts(() => {
            const excludeOldProduct = products.filter((ps) => ps.id != productBeingEdited!.id)
            return [...excludeOldProduct, updatedProduct]
        })

        setProductBeingEdited(null)
    }

    function deleteProduct(productBeingEdited: IProducts) {
        const removeProduct = products.filter((p) => p.id != productBeingEdited.id)

        setProducts(removeProduct)

        setProductBeingEdited(null)
    }

    return (
        <Modal isOpen={isProductModalOpen} close={() => { setProductBeingEdited(null); setIsProductModalOpen(false) }}>
            <div className={savedTheme == "light" ? styles.light : styles.dark}>
                <div className={styles.topTab}>
                    <div className={styles.setField}>
                        <p className={styles.label}>Id: </p>
                        <p className={styles.data}>
                            {
                                !!productBeingEdited
                                    ? productBeingEdited?.id
                                    : (products.length == 0 ? 1 :products.sort((a: IProducts, b: IProducts) => a.id > b.id ? -1 : 1)[0].id + 1)
                            }
                        </p>
                    </div>
                    <button className={styles.closeButton} onClick={() => { setProductBeingEdited(null); setIsProductModalOpen(false) }}>
                        <img src={xmark} alt="" />
                    </button>
                </div>
                <div className={styles.formField}>
                    <label htmlFor="nameInpt">Name</label>
                    <input ref={nameInput} id="nameInpt" type="text" />
                </div>
                <div className={styles.formField}>
                    <label htmlFor="quantityInpt">Quantity</label>
                    <input ref={quantityInput} id="quantityInpt" min="1" max="999999" type="number" />
                </div>
                <div className={styles.formField}>
                    <label htmlFor="priceInpt">Price</label>
                    <input ref={priceInput} id="priceInpt" type="number" />
                </div>
                <div className={styles.setField}>
                    <p className={styles.label}>Created At: </p>
                    <p className={styles.data}>
                        {
                            !!productBeingEdited
                                ? productBeingEdited.createdAt
                                : date
                        }
                    </p>
                </div>
                <div className={styles.setField}>
                    <p className={styles.label}>Updated At: </p>
                    <p className={styles.data}>
                        {
                            !!productBeingEdited
                                ? productBeingEdited.updatedAt
                                : "never"
                        }
                    </p>
                </div>
                <div className={styles.setField}>
                    <p className={styles.label}>Company Id: </p>
                    <p className={styles.data}>{currentUser.companyId}</p>
                </div>
                {
                    productBeingEdited != null
                        ? <div className={styles.editButtons}>
                            <button className={styles.removeButton} onClick={() => { deleteProduct(productBeingEdited); setIsProductModalOpen(false) }}>
                                <img src={trash} alt="" />
                            </button>
                            <button className={styles.saveProductButton} onClick={() => { editProduct(); setIsProductModalOpen(false) }}>Save</button>
                        </div>
                        : <button className={styles.addProductButton} onClick={() => addNewProduct()}>Add</button>
                }
            </div>
        </Modal>
    )
}