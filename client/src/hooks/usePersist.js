import { useState, useEffect } from "react"


const usePersist = () => {
    // Store in the local storage bool if user wants to be remembered.
    // As defualt assume user wants to be remembered.
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || true);

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist))
    }, [persist])

    return [persist, setPersist]
}
export default usePersist