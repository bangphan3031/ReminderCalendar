import React, { createContext, useState } from 'react';
import { useEffect } from 'react';
import axiosClient from '../axios-client';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState({})
    const [reloadEvent, setReloadEvent] = useState(false);
    const [showEventDetails, setShowEventDetails] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventList, setEventList] = useState([])

    useEffect(() => {
        axiosClient.get('/event')
          .then(response => {
            setEventList(response.data.data);
          })
          .catch(error => {
            console.log(error);
          });
    }, []);

    useEffect(() => {
        const storedEventList = localStorage.getItem('eventList');
        if (storedEventList) {
          setEventList(JSON.parse(storedEventList));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('eventList', JSON.stringify(eventList));
    }, [eventList]);

    const handleSelectedEvent = (event) => {
        setSelectedEvent(event);
    };

    const handleShowEventDetails = () => {
        setShowEventDetails(true);
    }

    const handleCloseEventDetails = () => {
        setShowEventDetails(false);
    }

    const handleCreateSuccess = () => {
        setReloadEvent(true);
    };

    const handleDeleteSuccess = () => {
        setReloadEvent(true);
    };

    const resetReloadEvent = () => {
        setReloadEvent(false);
    };

    // Hàm thêm event vào danh sách
    const addEvent = (event) => {
        setEventList((prevEventList) => [...prevEventList, event]);
    };

    const addEventList = (event) => {
        setEventList((prevEventList) => [...prevEventList, event]);
    };

    const removeEvent = (eventId) => {
        const updatedEventList = eventList.filter(event => event.id !== eventId);
        setEventList(updatedEventList);
    };

    // Hàm xóa event khỏi danh sách
    const removeEventsByCalendarId = (calendarId) => {
        const updatedEventList = eventList.filter(event => event.calendar_id !== calendarId);
        setEventList(updatedEventList);
    };

    // Hàm kiểm tra xem một event có trong danh sách hay không
    const hasEvent = (eventId) => {
        return eventList.some(event => event.id === eventId);
    };

    const contextValue = {
        user,
        loading,
        success,
        deleted,
        reloadEvent,
        showEventDetails,
        selectedEvent, 
        eventList, 
        setUser,
        setLoading,
        setSuccess,
        setDeleted,
        setSelectedEvent,
        handleCreateSuccess,
        handleDeleteSuccess,
        handleShowEventDetails,
        handleCloseEventDetails,
        resetReloadEvent,
        setEventList, 
        addEvent, 
        addEventList,
        removeEventsByCalendarId, 
        removeEvent,
        handleSelectedEvent,
        hasEvent
    };

    return (
        <AppContext.Provider value={contextValue}>
        {children}
        </AppContext.Provider>
    );
};
