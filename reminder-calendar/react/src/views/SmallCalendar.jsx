import React, {useState} from 'react'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../css/SmallCalendar.css'

export default function SmallCalendar(props) {
    const [selectedDate, setSelectedDate] = useState(null);

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
