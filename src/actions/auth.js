import Swal from "sweetalert2"
import { fetchWithOutToken, fetchWithToken } from "../helpers/fetch"
import { types } from "../types/types"

export const startLogin = (email,password) => {
    return async (dispatch) => {
        const response = await fetchWithOutToken('auth', {email,password}, 'POST')
        const body = await response.json()
        if (body.ok) {
            localStorage.setItem('token',body.token)
            localStorage.setItem('token-init-date',new Date().getTime())
            dispatch(login({
                uid:body.uid,
                name:body.name
            }))
        }else{
            Swal.fire('Error',body.message,'error')
        }

    }
}

export const login = (user)=>{
    return {
        type: types.authLogin,
        payload:user
    }
}

export const startRegister = (name,email,password)=>{
    return async(dispatch)=>{
        const response = await fetchWithOutToken('auth/newUser',{name,email,password},'POST');
        const body = await response.json();
        console.log(body);
        if (body.ok) {
            localStorage.setItem('token',body.token);
            localStorage.setItem('token-init-date',new Date().getTime());
            dispatch(login({
                uid:body.uid,
                name:body.name,
            }))
            Swal.fire('Success',body.message,'success')
        }else{
            if (body.email?.msg) Swal.fire('Error',body.email.msg,'error')
            if (body.name?.msg) Swal.fire('Error',body.name.msg,'error')
            if (body.message) Swal.fire('Error','El usuario ya existe','error')
        }
    } 
}

export const startChecking = ()=>{
    return async(dispatch)=>{
        const body = await fetchWithToken('auth/renewToken')
        const response = await body.json()
        if (response.ok) {
            const { name,uid } = response
            dispatch(login({name,uid}))
        }
        else{
            dispatch(checkingFinished())
        }
    }
}

export const checkingFinished = ()=>{
    return {
        type: types.authCheckingFinish
    }
}

export const startLogout = ()=>{
    return (dispatch)=>{
        localStorage.clear();
        dispatch(logout())
    }
}

export const logout = ()=>{
    return {
        type:types.authLogout, 
    }
}