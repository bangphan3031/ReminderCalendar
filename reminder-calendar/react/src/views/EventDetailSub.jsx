import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react'
import { FaCalendarAlt, FaClock, FaEdit, FaTimes, FaTrash, FaCheck, FaRedoAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext'
import axiosClient from '../axios-client';
import EditEvent from './EditEvent';

export default function EventDetailSub(props) {
    const { 
        handleCloseEventDetails, 
        selectedEvent, setLoading,
        handleEditSuccess,
        updated, setUpdated,   
    } = useContext(AppContext);
    const [showEventEdit, setShowEventEdit] = useState(false)

    const handleCloseEventDetail = () => {
        handleCloseEventDetails()
    }  

    useEffect (()=>{
        console.log(showEventEdit)
    },[showEventEdit])

    const handleUnCompletedEvent = async (eventId) => {
        handleCloseEventDetails()
        setLoading(true)
        try {
            const response = await axiosClient.patch(`/event/un-completed/${eventId}`)
            console.log(response.data)
            setLoading(false)
            setUpdated(true)
            handleEditSuccess();
            setTimeout(() => {
                setUpdated(false);
            }, 3000);
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    } 

    const handleClose = () => {
        setUpdated(false);
    };

    const handleMarkCompletedEvent = async (eventId) => {
        handleCloseEventDetails()
        setLoading(true)
        try {
            const response = await axiosClient.patch(`/event/mark-completed/${eventId}`)
            console.log(response.data)
            setLoading(false)
            setUpdated(true)
            handleEditSuccess()
            setTimeout(() => {
                setUpdated(false);
            }, 3000);
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    } 

    let formatTime = '';
    if (selectedEvent) {
        const allday = selectedEvent.is_all_day;
        const startTime = moment(selectedEvent.start_time).format('DD-MM-YYYY');
        const endTime = moment(selectedEvent.end_time).format('DD-MM-YYYY');
        const startTimeHs = moment(selectedEvent.start_time).format('h:mm a');
        const endTimeHs = moment(selectedEvent.end_time).format('h:mm a');
        formatTime = allday && startTime == endTime 
        ? moment(selectedEvent.start_time).format('DD-MM-YYYY')
        : allday && startTime != endTime
            ? moment(selectedEvent.start_time).format('DD-MM-YYYY') + " - " + moment(selectedEvent.end_time).format('DD-MM-YYYY')
            : !allday && startTime == endTime && startTimeHs != endTimeHs
            ? startTime + ", " + moment(selectedEvent.start_time).format('h:mm a') + " - " + moment(selectedEvent.end_time).format('h:mm a')
            : !allday && startTime == endTime && startTimeHs == endTimeHs
                ? startTime + ", " + moment(selectedEvent.start_time).format('h:mm a')
                : moment(selectedEvent.start_time).format('DD-MM-YYYY, h:mm a') + " - " + moment(selectedEvent.end_time).format('DD-MM-YYYY, h:mm a');
    }

    return (
        <div>
            {selectedEvent && showEventEdit && (
                <EditEvent 
                    selectedEvent={selectedEvent} 
                />
            )}
            {updated ? (
                <div className="loading-overlay-wrapper">
                    <div className="notification-content-overlay">
                        <div className="loading-box">
                            <div className="loading-content">
                                <p>Thành công.</p>
                                <button
                                    onClick={handleClose}
                                    title="Close"
                                    className="close-notification btn btn-outline-secondary border-0 rounded-5">
                                    <FaTimes />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
            <div className="event-detail justify-content-center align-items-center w-100">
                <div className="event-detail rounded-3">
                    <header className="px-3 py-1 d-flex align-items-center">
                        <Link to={`/edit-event?id=${selectedEvent.id}`}>
                            <button 
                                title='Edit' 
                                className='edit btn btn-outline-secondary border-0 rounded-5'
                                >
                                <FaEdit />
                            </button>
                        </Link>
                        <button 
                            title='Unmark completed' 
                            className='delete btn btn-outline-secondary border-0 rounded-5'
                            onClick={() => handleUnCompletedEvent(selectedEvent.id)}>
                            <FaRedoAlt />
                        </button>
                        <button 
                            title='Mark completed' 
                            className='delete btn btn-outline-secondary border-0 rounded-5'
                            onClick={() => handleMarkCompletedEvent(selectedEvent.id)}>
                            <FaCheck />
                        </button>
                        <button 
                            title='Close'
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
                            <p className='event-time'>
                                {formatTime}
                            </p>
                        </div>
                    </div>
                    <div className="row p-3">
                        <div className="calendar-icon col-1"><FaCalendarAlt /></div>
                        <div className="col" >
                            <div className='calendar-name'>
                                {selectedEvent.creator_calendar ? selectedEvent.creator_calendar : selectedEvent.name}
                                {selectedEvent.creator ? 
                                    <p className='small text-muted'>
                                    Create by: {selectedEvent.creator}
                                    </p> : ''
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
