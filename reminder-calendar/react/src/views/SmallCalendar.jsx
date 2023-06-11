import React, {useContext, useEffect, useState} from 'react'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../css/SmallCalendar.css'
import { AppContext } from '../contexts/AppContext';
import moment from 'moment';

export default function SmallCalendar(props) {
    const [selectedDate, setSelectedDate] = useState(null);
    const {selectedEvent} = useContext(AppContext)

    useEffect(()=>{
        if(selectedEvent) {
            const outputFormat = 'ddd MMM DD YYYY';
            const fortmat_time = moment(selectedEvent.start_time).format(outputFormat);
            setSelectedDate(fortmat_time)
        }
    },[selectedEvent])

    const handleDateClick = (date) => {
        props.onDateClick(date);
        setSelectedDate(date)
    };

    return (
        <div>
            <div className='calendar-container'>
                <Calendar onChange={handleDateClick} value={selectedDate} />
            </div>
        </div>
    )
}
