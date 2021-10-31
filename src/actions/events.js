import { types } from "../types/types"
import { fetchWithToken } from "../helpers/fetch"
import { prepareEvents } from "../helpers/prepareEvents"
import Swal from "sweetalert2"

export const eventStartAddNew = (event)=>{
    return async(dispatch,getState)=>{

        const { uid,name } = getState().auth

        const response = await fetchWithToken('event',event,'POST')
        const body = await response.json()

        try {
            if (body.ok) {
                event.id = body.id
                event.user = {
                    _id:uid,
                    name
                }
            }
            dispatch(eventAddNew(event))
        } catch (err) {
            console.log(err);
        }
    }
}
const eventAddNew = (event) => {
    return {
        type:types.eventAddNew,
        payload:event
    }
}
export const eventSetActive = (event) => {
    return {
        type:types.eventSetActive,
        payload:event
    }
}
export const eventStartUpdating = (event) =>{
    return async(dispatch) =>{
        const response = await fetchWithToken(`event/${event.id}`,event,'PUT')
        const body = await response.json()
        try {
            dispatch(eventUpdated(event))
            if (body.ok) {
                Swal.fire('Success',`Evento actualizado`,'success')
            }else{
                Swal.fire('Error',`No se pudo actualizar el evento`,'error')
            }
        } catch (error) {
            Swal.fire('Error',error,'error')
        }
    }
}
export const eventUpdated = (event) => {
    return {
        type:types.eventUpdated,
        payload:event
    }
}
export const eventClearActiveEvent = () => {
    return {
        type:types.eventClearActive,
    }
}
export const startDeleting = (idEventActive)=> {
    return async (dispatch) => {
        const body = await fetchWithToken(`event/${idEventActive}`,{},'DELETE');
        try {
            if (body.ok) {
                dispatch(eventDeleted(idEventActive))
                Swal.fire('Success',`Evento eliminado`,'success')
            }else{
                Swal.fire('Error',`No se pudo borrar el evento`,'error')
            }
        } catch (error) {
            Swal.fire('Error',error,'error')
        }

    }
}
const eventDeleted = (event) => {
    return {
        type:types.eventDeleted,
        payload:event
    }
}
export const eventStartLoading = () => {
    return async (dispatch) => {
        const response = await fetchWithToken('event')
        const body = await response.json()
        const events = prepareEvents(body.findEvents);
        dispatch(eventLoaded(events))
    }
    
}
const eventLoaded = (event) => {
    return{
        type:types.eventLoaded,
        payload:event
    }
}
export const eventLogout = () => {
    return {
        type:types.eventLogout,
    }
}
