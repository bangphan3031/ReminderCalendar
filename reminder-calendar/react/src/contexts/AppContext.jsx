import React, { createContext, useState } from 'react';
import { useEffect } from 'react';
import axiosClient from '../axios-client';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState({})
    const [reloadEvent, setReloadEvent] = useState(false);
    const [reloadCalendar, setReloadCalendar] = useState(false);
    const [showEventDetails, setShowEventDetails] = useState(false);
    const [showEditCalendar, setShowEditCalendar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [calendarSelected, setCalendarSelected] = useState(null);
    const [eventList, setEventList] = useState([])
    const [reloadStorage, setReloadStorage] = useState([])
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [calendar, setCalendar] = useState([])
    const [selectedCalendars, setSelectedCalendars] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get('calendar');
                console.log(response.data.data)
                // setCalendar(response.data.data);
                // setCalendarSelected(response.data.data[0]);
            } catch (error) {
                console.log(error)
            }
        };
        fetchData();
    }, []);

    //console.log('calendar'+calendar, 'select calendar'+calendarSelected)

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

    const handleShowEditCalendar = () => {
        setShowEditCalendar(true);
    }

    const handleCloseEditCalendar = () => {
        setShowEditCalendar(false);
    }

    const handleEditCalendarSuccess = () => {
        setReloadCalendar(true);
    }
    
    const resetReloadCalendar = () => {
        setReloadCalendar(false);
    };

    const handleCreateSuccess = () => {
        setReloadEvent(true);
    };

    const handleEditSuccess = () => {
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
        updated, setUpdated,
        reloadEvent, 
        reloadCalendar, setReloadCalendar,
        showEventDetails, 
        selectedEvent, setSelectedEvent,
        eventList, setEventList, 
        calendar, setCalendar,
        calendarSelected, setCalendarSelected,
        selectedCalendars, setSelectedCalendars,
        reloadStorage, setReloadStorage,
        isLoadingData, setIsLoadingData,
        updateSelectedCalendars,
        handleShowEventDetails,
        handleCloseEditCalendar,
        handleEditCalendarSuccess,
        resetReloadCalendar,
        handleCreateSuccess,
        handleEditSuccess,
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
