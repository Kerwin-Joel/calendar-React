import React, { useEffect, useState } from 'react'

import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import Swal from 'sweetalert2'

import { useDispatch, useSelector } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import { eventClearActiveEvent, eventStartAddNew, eventStartLoading, eventStartUpdating } from '../../actions/events';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root');
    const now = moment().minutes(0).seconds(0).add(1,'hours');
    const nowPlus1 = now.clone().add(1,'hours');


    const initEvent = {
        title:'',
        notes:'',
        start:now.toDate(),
        end:nowPlus1.toDate()
    }

export const CalendarModal = () => {
    

    const { modalOpen } = useSelector(state => state.ui)
    const { activeEvent } = useSelector(state => state.calendar)
    const { uid } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const [titleValid, setTitleValid] = useState(true)
    const [formValues, setFormValues] = useState(initEvent)
    const { title,notes,start,end } = formValues

    useEffect(() => {

        if (activeEvent) {// el modal esta activo
            setFormValues(activeEvent)
        }else{
            setFormValues(initEvent)
        }
    }, [activeEvent,dispatch])

    const handleInputChange = ({target}) => {
        setFormValues({
            ...formValues,
            [target.name]:target.value
        })

    }
    useEffect(() => {
        if (!modalOpen) dispatch(eventStartLoading())
        if (modalOpen) dispatch(eventStartLoading())
    }, [dispatch,modalOpen])

    const closeModal = () => {
        dispatch( uiCloseModal() )
        dispatch(eventClearActiveEvent())
        setFormValues(initEvent)
    }

    const handleStartDateChange  = (e) => {
        setFormValues({
            ...formValues,
            start:e
        })
    }
    const handleEndDateChange = (e) => {
        setFormValues({
            ...formValues,
            end:e
        })
    }
    const handleSubmitForm = (e) => {
        e.preventDefault();
        const momentStart = moment(start)
        const momentEnd = moment(end)

        if(momentStart.isSameOrAfter(momentEnd)){
            Swal.fire('Error','La fecha fin debe ser mayor a la hora final','error')
            return;
        }
        if(title.trim().length < 3){
            return setTitleValid(false)
        }

        setTitleValid(true)
        dispatch( uiCloseModal() )

        if(activeEvent){
            if(uid === activeEvent.user._id){
                dispatch(eventStartUpdating(formValues))
            }else{
                Swal.fire('Error','No eres propietario del evento','error')
            }
        }else{
            dispatch(eventStartAddNew(formValues))
        }

        setFormValues(initEvent)
    }

    return (
        <Modal
        isOpen={modalOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        closeTimeoutMS={200}
        className="modal"
        overlayClassName="modal-fondo"
        >
            <h1> {activeEvent ? 'Actualizando evento' : 'Nuevo evento'} </h1>
            <hr />
            <form 
                className="container"
                onSubmit={handleSubmitForm}
                >

                <div className="form-group">
                    <label>Fecha y hora inicio</label>
                    <DateTimePicker
                        className="form-control"
                        onChange={handleStartDateChange}
                        value={start}
                    />
                </div>

                <div className="form-group">
                    <label>Fecha y hora fin</label>
                    <DateTimePicker
                        className="form-control"
                        onChange={handleEndDateChange}
                        value={end}
                        minDate={start}
                    />
                </div>

                <hr />
                <div className="form-group">
                    <label>Titulo y notas</label>
                    <input 
                        type="text" 
                        className= {`form-control ${!titleValid ? 'is-invalid' : null}`}
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={title}
                        onChange={handleInputChange}
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group">
                    <textarea 
                        type="text" 
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={notes}
                        onChange={handleInputChange}
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>
            </form>
        </Modal>
    )
}
