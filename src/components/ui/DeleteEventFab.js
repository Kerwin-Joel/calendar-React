import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { startDeleting } from '../../actions/events'

export const DeleteEventFab = () => {

    const dispatch = useDispatch()

    const eventId  = useSelector(state => state.calendar.activeEvent.id)
    const { _id }  = useSelector(state => state.calendar.activeEvent.user)
    const { uid }  = useSelector(state => state.auth)
    
    const handleDelete = () => {
        if (_id === uid) dispatch(startDeleting(eventId))
        else Swal.fire('Error','No tienes permiso','error')
    }

    return (
        <button
            className="btn btn-danger fab-danger"
            onClick={handleDelete}
        >
            <i className="fas fa-trash"></i>
            <span>Borrar evento</span>
        </button>
    )
}
