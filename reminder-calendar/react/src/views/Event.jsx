import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axiosClient from '../axios-client';
import { FaTimes, FaCalendarAlt, FaClock, FaEdit, FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import EditEvent from './EditEvent';
import EventDetail from './EventDetail';
import UpcomingEvent from './UpcomingEvent';

const localizer = momentLocalizer(moment);

export default function Event(props) {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(props.selectedDate);
    const [selectedEvent, setSelectedEvent] = useState();
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
            name: event.name,
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

    const handleDeleteEvent = (id) => {
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
        setSelectedEvent(null)
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
        <div style={{ height: '91vh'}}>
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
            <EventDetail 
                selectedEvent={selectedEvent} 
                handleCloseEventDetail={handleCloseEventDetail} 
                handleDeleteEvent={handleDeleteEvent} 
            />
        )}
        </div>
    );
};

