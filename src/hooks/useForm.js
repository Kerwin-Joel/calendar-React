import { useState } from "react"

export const useForm = (initialState = {}) => {

    const [values, setValues] = useState(initialState);

    const handleInputChange = ({target}) => { // en vez del evento e, le pasamos el target desestructurado
        setValues('')
        setValues({
            ...values,
            //esto se lee como
            //una key del objeto []
            [target.name] : target.value
        })
    };
    const reset = ()=>{
        setValues(initialState)
    }
    return [values,handleInputChange,reset]
}
