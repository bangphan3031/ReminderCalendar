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
    const [calendarSelected, setCalendarSelected] = useState(null);
    const [eventList, setEventList] = useState([])
    const [selectedCalendars, setSelectedCalendars] = useState([]);

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

    const contextValue = {
        user, setUser,
        loading, setLoading,
        success, setSuccess,
        deleted, setDeleted,
        reloadEvent, 
        showEventDetails, 
        selectedEvent, setSelectedEvent,
        eventList, setEventList, 
        calendarSelected, setCalendarSelected,
        selectedCalendars, setSelectedCalendars,
        handleShowEventDetails,
        handleCreateSuccess,
        handleDeleteSuccess,
        handleCloseEventDetails,
        resetReloadEvent,
        handleSelectedEvent,
    };

    return (
        <AppContext.Provider value={contextValue}>
        {children}
        </AppContext.Provider>
    );
};
