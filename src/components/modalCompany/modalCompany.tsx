import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { ICompany } from "../../Interfaces/ICompany";
import { Modal } from "../modalComponent/modalComponent";
import styles from "./modalCompany.module.scss"
import xmark from "../../assets/xmark-white.svg"
import { useData } from "../../hooks/dataContext";

interface ICompanyContentProps {
    isCompanyModalOpen: boolean,
    setIsCompanyModalOpen: Dispatch<SetStateAction<boolean>>,
    companyBeingEdited: ICompany | null,
    setCompanyBeingEdited: Dispatch<SetStateAction<ICompany | null>>,
    savedTheme: string | null,
}

export function ModalCompany({ isCompanyModalOpen, setIsCompanyModalOpen, companyBeingEdited, setCompanyBeingEdited, savedTheme }: ICompanyContentProps) {

    const { companies, setCompanies } = useData()

    const nameInput = useRef<HTMLInputElement>(null)

    const cnpjInput = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!nameInput.current || !cnpjInput.current) return

        if (!companyBeingEdited) {
            nameInput.current.value = ""
            cnpjInput.current.value = ""
            return
        }

        nameInput.current.value = companyBeingEdited.companyName
        cnpjInput.current.value = companyBeingEdited.CNPJ
    }, [companyBeingEdited])

    function editCompany() {

        if (!nameInput.current || !cnpjInput.current) return

        if (nameInput.current.value == "" || cnpjInput.current.value == "") {
            window.alert("All fields must be filled!")
            return
        }

        const foundCnpj = companies.find(cp => cp.CNPJ == cnpjInput.current!.value)

        if (foundCnpj) {
            window.alert("This CNPJ is already registered")
            return
        }

        const updatedCompany: ICompany = {
            id: companyBeingEdited!.id,
            companyName: nameInput.current!.value,
            CNPJ: cnpjInput.current!.value,
            active: companyBeingEdited!.active
        }

        setCompanies(() => {
            const excludeOldCompany = companies.filter((ps) => ps.id != companyBeingEdited!.id)
            return [...excludeOldCompany, updatedCompany]
        })

        setCompanyBeingEdited(null)
        setIsCompanyModalOpen(false)
    }

    return (
        <Modal isOpen={isCompanyModalOpen} close={() => { setCompanyBeingEdited(null); setIsCompanyModalOpen(false) }}>
            <div className={savedTheme == "light" ? styles.light : styles.dark}>
                <div className={styles.topTab}>
                    <div className={styles.setField}>
                        <p className={styles.label}>Id: </p>
                        <p className={styles.data}>{companyBeingEdited?.id}</p>
                    </div>
                    <button className={styles.closeButton} onClick={() => { setCompanyBeingEdited(null); setIsCompanyModalOpen(false) }}>
                        <img src={xmark} alt="" />
                    </button>
                </div>
                <div className={styles.formField}>
                    <label htmlFor="nameInpt">Name</label>
                    <input ref={nameInput} id="nameInpt" type="text" />
                </div>
                <div className={styles.formField}>
                    <label htmlFor="cnpjInpt">CNPJ</label>
                    <input ref={cnpjInput} id="cnpjInpt" type="text" />
                </div>
                <button className={styles.saveCompanyButton} onClick={() => { editCompany() }}>Save</button>
            </div>
        </Modal>
    )
}