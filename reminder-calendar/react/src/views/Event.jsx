import React, { useState, useEffect, useContext } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axiosClient from '../axios-client';
import EventDetail from './EventDetail';
import { AppContext } from '../contexts/AppContext';
import Loading from './Loading';
import { Watch } from 'react-loader-spinner';

const localizer = momentLocalizer(moment);

export default function Event(props) {
    const { 
        reloadEvent, 
        resetReloadEvent, 
        handleDeleteSuccess, 
        handleShowEventDetails, 
        handleCloseEventDetails, 
        showEventDetails,
        handleSelectedEvent,
        selectedCalendars, 
        setLoading, setDeleted,
    } = useContext(AppContext);
    const [initialLoad, setInitialLoad] = useState(true);
    const [selectedValue, setSelectedValue] = useState(localStorage.getItem('selectedValue') || 'month');
    const [selectedDate, setSelectedDate] = useState(props.selectedDate);
    const [myEventsList, setMyEventsList] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [load, setLoad] = useState(true);

    const formatEvents = (events) => {
        return events.map(event => ({
            id: event.id,
            event_id: event.event_id,
            calendar_id: event.calendar_id,
            title: event.title,
            all_day: event.is_all_day,
            start: new Date(event.start_time),
            end: new Date(event.end_time),
            location: event.location,
            description: event.description,
            color: event.color,
            name: event.name,
            creator: event.creator,
            creator_calendar: event.creator_calendar,
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
            event_id: event.event_id,
            calendar_id: event.calendar_id,
            title: event.title,
            start_time: moment(event.start).format('YYYY-MM-DD h:mm a'),
            end_time: moment(event.end).format('YYYY-MM-DD h:mm a'),
            is_all_day: event.all_day,
            location: event.location,
            description: event.description,
            color: event.color,
            name: event.name,
            creator: event.creator,
            creator_calendar: event.creator_calendar,
        });
        handleShowEventDetails();
    };

    const handleDeleteEvent = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa công việc này không?')) {
            handleCloseEventDetails();
            setLoading(true);
            axiosClient.delete(`/event/${id}`)
                .then(response => {
                    handleDeleteSuccess();
                    setDeleted(true);
                    setLoading(false);
                    setTimeout(() => {
                        setDeleted(false);
                    }, 3000);
                })
                .catch(error => {
                    console.log(error);
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        localStorage.setItem("selectedValue", selectedValue);
    }, [selectedValue]);
    
    useEffect(() => {
        let isReloadEvent = false;
        const fetchEvents = async () => {
            try {
                const response = await axiosClient.get('/event');
                const formattedEvents = formatEvents(response.data.data);
                setMyEventsList(formattedEvents);
                setLoad(false);
            } catch (error) {
                console.log(error);
                setLoad(false);
            }
        };
        if (initialLoad) {
            fetchEvents();
            setInitialLoad(false);
        } else {
            if (reloadEvent) {
                isReloadEvent = true;
            }
            if (isReloadEvent) {
                fetchEvents();
                resetReloadEvent();
            }
        }
    }, [initialLoad, reloadEvent]);

    useEffect(() => {
        // Lọc danh sách event dựa trên các calendar đã được chọn
        const filtered = myEventsList.filter(event => selectedCalendars.includes(event.calendar_id));
        setFilteredEvents(filtered);
    }, [myEventsList, selectedCalendars]);

    return (
        <div style={{height: '92vh'}}>
        <Calendar
            localizer={localizer}
            view={selectedValue}
            onView={(view) => handleViewChange(view)}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%'}}
            date={selectedDate}
            onNavigate={handleNavigate}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
        />
        {load ? (
            <div className="loading-overlay-event">
                <Watch
                    height={100}
                    width={100}
                    color="#ccc"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="#4fa94d"
                    strokeWidth={5}
                    strokeWidthSecondary={2}
                />
            </div>
        ) : (
        <>
        {showEventDetails && (
            <EventDetail 
                handleDeleteEvent={handleDeleteEvent} 
            />
        )}
        </>)}
        </div>
    );
};

