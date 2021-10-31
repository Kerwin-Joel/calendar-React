import React, { useEffect, useState } from 'react'
import {Calendar,momentLocalizer} from 'react-big-calendar'
import { useDispatch } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';
import moment from 'moment'
import 'moment/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Navbar } from '../ui/Navbar'
import { messages } from '../../helpers/calendar-messages'
import { CalendarEvent } from './CalendarEvent'
import { CalendarModal } from './CalendarModal'
import { eventClearActiveEvent, eventSetActive, eventStartLoading } from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFab';
import { useSelector } from 'react-redux';
import { DeleteEventFab } from '../ui/DeleteEventFab';


const localizer = momentLocalizer(moment) 
moment.locale('es');

export const CalendarScreen = () => {

    const dispatch = useDispatch()
    const {uid} = useSelector(state => state.auth)
    
    const {events,activeEvent} = useSelector(state => state.calendar)
    const {modalOpen} = useSelector(state => state.ui)

    const [lastview, setLastView] = useState(localStorage.getItem('lastview') || 'week')

    const eventStyleGetter = (event,start,end,isSelected) => { 
        const style = {
            backgroundColor: (uid === event.user._id) ? '#367CF7' : '#894ffb',
            borderRadius:'0px',
            opacity:'0.8',
            display:'block',
            color:'white'
        }

        return {
            style
        }
    }


    useEffect(() => {
        if (!modalOpen) dispatch(eventStartLoading())
        if (modalOpen) dispatch(eventStartLoading())
    }, [dispatch,modalOpen])

        
    const onDoubleClick= () => {
        dispatch(uiOpenModal())
    }
    const onSelect= (event) => {
        dispatch(eventSetActive(event))
    }
    const onViewChange = (e) => {
        setLastView(e);
        localStorage.setItem('lastview',e)
    }
    const  onSelectSlot = () => {
        dispatch(eventClearActiveEvent())
    }

    

    return (
        <div className="calendar-screen">
            <Navbar/>
            <div>
                <Calendar
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    localizer={localizer}
                    messages={messages}
                    eventPropGetter={eventStyleGetter}
                    onDoubleClickEvent={onDoubleClick}
                    onSelectEvent={onSelect}
                    onView={onViewChange}
                    view={lastview}
                    onSelectSlot={onSelectSlot}
                    selectable={true}
                    components={{
                        event:CalendarEvent
                    }}
                />
            </div>
            {
                activeEvent && <DeleteEventFab/>
            }
            <AddNewFab/>
            <CalendarModal/>
        </div>
    )
}
