import React, { useState, useEffect, useContext } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axiosClient from '../axios-client';
import { Link, useNavigate } from 'react-router-dom';
import EventDetail from './EventDetail';
import { AppContext } from '../contexts/AppContext';

const localizer = momentLocalizer(moment);

export default function Event(props) {
    const { 
        reloadEvent, 
        resetReloadEvent, 
        handleDeleteSuccess, 
        handleShowEventDetails, 
        handleCloseEventDetails, 
        showEventDetails,
        selectedEvent, 
        eventList,
        removeEvent,
        handleSelectedEvent,
        setEventList
    } = useContext(AppContext);
    const navigate = useNavigate();
    const [isReload, setIsReload] = useState(false);
    const [selectedValue, setSelectedValue] = useState(localStorage.getItem('selectedValue') || 'month');
    const [selectedDate, setSelectedDate] = useState(props.selectedDate);
    const [myEventsList, setMyEventsList] = useState([]);

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

    const handleViewChange = (view) => {
        setSelectedValue(view);
        localStorage.setItem('selectedValue', view);
    };

    useEffect(() => {
        setSelectedDate(props.selectedDate);
    }, [props.selectedDate]);

    const handleNavigate = (date, view) => {
        setSelectedDate(date);
    };

    const handleSelectEvent = event => {
        handleSelectedEvent({
            id: event.id,
            calendar_id: event.calendar_id,
            title: event.title,
            start_time: event.start,
            end_time: event.end,
            is_all_day: event.all_day,
            location: event.location,
            description: event.description,
            color: event.color,
            name: event.name,
        });
        handleShowEventDetails();
    };

    const handleDeleteEvent = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa công việc này không?')) {
          axiosClient.delete(`/event/${id}`)
            .then(response => {
                removeEvent(id)
                handleCloseEventDetails();
                handleDeleteSuccess();
                alert('Xóa thành công')
            })
            .catch(error => {
              console.log(error);
            });
        }
    };

    useEffect(() => {
        localStorage.setItem("selectedValue", selectedValue);
    }, [selectedValue]);
    
    // useEffect(() => {
    //     const fetchEvents = async () => {
    //     try {
    //         const response = await axiosClient.get('/event');
    //         const formattedEvents = formatEvents(response.data.data);
    //         setMyEventsList(formattedEvents);
    //         resetReloadEvent();
    //     } catch (error) {
    //         console.log(error);
    //     }
    //     };
    //     fetchEvents();
    // }, [reloadEvent]);

    useEffect(() => {
        //const storedEventList = localStorage.getItem('eventList');
        const formattedEvents = formatEvents(eventList);
        setMyEventsList(formattedEvents)
        resetReloadEvent()
    }, [reloadEvent]);

    return (
        <div style={{ height: '91vh'}}>
        <Calendar
            localizer={localizer}
            view={selectedValue}
            onView={(view) => handleViewChange(view)}
            events={myEventsList}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            date={selectedDate}
            onNavigate={handleNavigate}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
        />
        {showEventDetails && (
            <EventDetail 
                handleDeleteEvent={handleDeleteEvent} 
            />
        )}
        </div>
    );
};

