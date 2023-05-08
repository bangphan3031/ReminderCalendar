import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axiosClient from '../axios-client';
import { FaTimes, FaCalendarAlt, FaClock, FaEdit, FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import EditEvent from './EditEvent';

const localizer = momentLocalizer(moment);

export default function Event(props) {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(props.selectedDate);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [myEventsList, setMyEventsList] = useState([]);
    const [showEventDetail , setShowEventDetail] = useState(false);

    const formatEvents = (events) => {
        return events.map(event => ({
            id: event.id,
            calendar_id: event.calendar_id,
            title: event.title,
            all_day: event.is_all_day,
            start: new Date(event.start_time),
            end: new Date(event.end_time),
            location: event.location,
            description: event.description,
            color: event.color,
            calendar_name: event.name,
        }));
    };
    
    const eventStyleGetter = (event, start, end, isSelected) => {
        const backgroundColor = event.color || '#3174ad'; 
        const style = {
            backgroundColor,
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '0',
            display: 'block',
            boxShadow: '0 1px 0 rgba(0, 0, 0, 0.1), 0 1px 0 rgba(0, 0, 0, 0.15)',
            cursor: 'pointer',
        };
        return {
            style,
        };
    };

    useEffect(() => {
        setSelectedDate(props.selectedDate);
    }, [props.selectedDate]);

    const handleNavigate = (date, view) => {
        setSelectedDate(date);
    };

    const handleSelectEvent = event => {
        setSelectedEvent(event);
        setShowEventDetail(true);
    };

    const handleDeleteCalendar = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa công việc này không?')) {
          axiosClient.delete(`/event/${id}`)
            .then(response => {
                setMyEventsList(myEventsList.filter(event => event.id !== id));
                setShowEventDetail(false);
                alert('Xóa thành công')
            })
            .catch(error => {
              console.log(error);
            });
        }
    };
    
    const handleCloseEventDetail  = () => {
        setShowEventDetail(false);
    };
    
    useEffect(() => {
        const fetchEvents = async () => {
        try {
            const response = await axiosClient.get('/event');
            const formattedEvents = formatEvents(response.data.data);
            setMyEventsList(formattedEvents);
        } catch (error) {
            console.log(error);
        }
        };
        fetchEvents();
    }, []);

    return (
        <div style={{ height: '90vh' }}>
        <Calendar
            localizer={localizer}
            events={myEventsList}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            date={selectedDate}
            onNavigate={handleNavigate}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
        />
        {selectedEvent && showEventDetail && (
            <div>
                <div className="event-detail justify-content-center align-items-center w-100">
                    <div className="event-detail rounded-3">
                        <header className="px-3 py-1 d-flex align-items-center">
                            <Link to={`/edit-event?id=${selectedEvent.id}`}>
                                <button title='Edit' 
                                    className='edit btn btn-outline-secondary border-0 rounded-5'>
                                    <FaEdit />
                                </button>
                            </Link>
                            <button title='delete' 
                                className='delete btn btn-outline-secondary border-0 rounded-5'
                                onClick={() => handleDeleteCalendar(selectedEvent.id)}>
                                <FaTrash />
                            </button>
                            <button title='Close'
                                onClick={handleCloseEventDetail}
                                className='close btn btn-outline-secondary border-0 rounded-5'>
                                <FaTimes />
                            </button>
                        </header>
                        <div className="row p-3">
                            <div className="col-1">
                                <div className='calendar-color' style={{ backgroundColor: selectedEvent.color}}></div>
                            </div>
                            <div className="col">
                                <h5>{selectedEvent.title}</h5>
                                {selectedEvent.description && <p>{selectedEvent.description}</p>}
                            </div>
                        </div>
                        <div className="row p-3 pt-0">
                            <div className="col-1"><FaClock /></div>
                            <div className="col">
                            <p className='event-time'>{moment(selectedEvent.start).format('DD-MM-YYYY, h:mm a')} - {moment(selectedEvent.end).format('DD-MM-YYYY, h:mm a')}</p>
                            </div>
                        </div>
                        <div className="row p-3">
                            <div className="calendar-icon col-1"><FaCalendarAlt /></div>
                            <div className="col" >
                                <div className='calendar-name'>{selectedEvent.calendar_name}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         )}
        </div>
    );
};

