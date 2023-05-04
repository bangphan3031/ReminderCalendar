import React, {useState} from 'react'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../css/SmallCalendar.css'

export default function SmallCalendar(props) {

    const handleDateClick = (date) => {
        props.onDateClick(date);
    };

    const [date, setDate] = useState(new Date());
    return (
        <div>
            <div className='calendar-container'>
                <Calendar onChange={handleDateClick} value={date} />
            </div>
        </div>
    )
}
