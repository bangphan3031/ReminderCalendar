import React, { createContext, useState } from 'react';
import { useEffect } from 'react';

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
    const [reloadStorage, setReloadStorage] = useState([])
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [selectedCalendars, setSelectedCalendars] = useState([])

    useEffect(() => {
        const storedSelectedCalendars = localStorage.getItem('selectedCalendars');
        if (storedSelectedCalendars && storedSelectedCalendars.length > 0) {
          setSelectedCalendars(JSON.parse(storedSelectedCalendars));
        }
    }, []);

    const updateSelectedCalendars = (newSelectedCalendars) => {
        setSelectedCalendars(newSelectedCalendars);
        localStorage.setItem('selectedCalendars', JSON.stringify(newSelectedCalendars));
    };

    useEffect(() => {
        if (reloadStorage) {
          const storedSelectedCalendars = localStorage.getItem('selectedCalendars');
          if (storedSelectedCalendars) {
            setSelectedCalendars(JSON.parse(storedSelectedCalendars));
          }
          setReloadStorage(false); 
        }
    }, [reloadStorage]);

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
        reloadStorage, setReloadStorage,
        isLoadingData, setIsLoadingData,
        updateSelectedCalendars,
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
