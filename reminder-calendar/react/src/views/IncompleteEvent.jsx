import React, { useContext, useEffect, useState } from 'react';
import axiosClient from '../axios-client';
import moment from 'moment';
import { FaTrash, FaCheck, FaTimes, FaEye, FaPrint } from 'react-icons/fa';
import { Watch } from 'react-loader-spinner'
import { AppContext } from '../contexts/AppContext';
import Loading from './Loading';
import { Link } from 'react-router-dom';
import SubLayoutHeader from './SubLayoutHeader';

export default function IncompleteEvent() {
    const [eventList, setEventList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [reloadEvent, setReloadEvent] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const { 
        loading, 
        setLoading, 
        success, setSuccess,
        deleted, setDeleted, 
    } = useContext(AppContext);

    useEffect(() => {
        let isReloadEvent = false;
        const fetchEvents = async () => {
            try {
                const response = await axiosClient.get('/event');
                console.log(reloadEvent)
                console.log('loading')
                setEventList(response.data.data);
                setReloadEvent(false);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
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
            }
        }
    }, [initialLoad, reloadEvent]);

    const handleClose = () => {
        setDeleted(false);
        setSuccess(false);
    };

    const handleRestore = (eventId) => {
        setLoading(true);
        axiosClient.patch(`/event/restore/${eventId}`)
        .then((response) => {
            console.log(response.data)
            setSuccess(true)
            setLoading(false)
            setEventList(eventList.filter(event => event.id !== eventId));
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        })
        .catch((error) => {
            console.error(error);
        });
    };
    
    const handleForceDelete = (eventId) => {
        if (window.confirm('Sự kiện sẽ bị xóa vĩnh viễn. Bạn có chắc chắn không?')) {
            setLoading(true);
            axiosClient.delete(`/event/force-delete/${eventId}`)
            .then((response) => {
                console.log(response.data);
                setDeleted(true)
                setLoading(false)
                setReloadEvent(true);
                setTimeout(() => {
                    setDeleted(false);
                }, 3000);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false)
            });
        }
    }; 

    return (
        <div>
            {loading && <Loading />}
            {success || deleted ? (
                <div className="loading-overlay-wrapper">
                    <div className="notification-content-overlay">
                        <div className="loading-box">
                            <div className="loading-content">
                                {success ? (
                                    <p>Phục hồi thành công.</p>
                                    ) : deleted ? (
                                    <p>Xóa thành công.</p>
                                ) : null}
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
            <div className="recycle-bin">
                <div className="row">
                    <SubLayoutHeader />
                </div>
                <div className="row">
                    <div className="col-1" style={{ width: "200px", height:"200px" }}>
                        <Link to="/search" className='text-decoration-none text-secondary'>
                            <div className="row mb-2 mt-2 sidebar-title-row">
                                <div className='ms-3 mt-2 mb-2'>
                                    Search Event
                                </div>
                            </div>
                        </Link>
                        <Link to="/completed-event" className='text-decoration-none text-secondary'>
                            <div className="row mb-2 mt-2 sidebar-title-row">
                                <div className='ms-3 mt-2 mb-2'>
                                    Completed Events
                                </div>
                            </div>
                        </Link>
                        <Link to="/incomplete-event" className='text-decoration-none text-secondary'>
                            <div className="row mb-2 mt-2 sidebar-title-row-choose">
                                <div className='ms-3 mt-2 mb-2'>
                                    Incomplete Events
                                </div>
                            </div>
                        </Link>
                        <Link to="/trash" className='text-decoration-none text-secondary'>
                            <div className="row mb-2 mt-2 sidebar-title-row">
                                <div className='ms-3 mt-2 mb-2'>
                                    Trash
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col">
                        <div className="d-flex mt-1 text-secondary ms-2 mt-3 mb-2">
                            <h4 className='mt-2 mb-2'>Incomplete Events</h4>
                            <div className="ms-auto me-2">
                                <button className='clear-all-trash-button btn btn-outline-secondary rounded-2 border-0 mt-1 ms-1 mb-1'>
                                <div className="d-flex">
                                    <div className='clear-trash-icon'><FaPrint /></div>
                                    <div className='clear-trash-lable ms-2'><span>Export file</span></div>
                                </div>
                                </button>
                            </div>
                        </div>
                        {isLoading ? (
                            <div className="loading-overlay-trash">
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
                            {eventList.length > 0 ? (
                                <div className='event-deleted'>
                                    <div className='row mt-1'>
                                        <div className='col-2 ps-4'>Calendar</div>
                                        <div className='col-2'>Title</div>
                                        <div className='col-2'>Date</div>
                                        <div className='col-1'>Time</div>
                                        <div className='col-2'>Organizer</div>
                                        <div className='col-2'>Created date</div>
                                        <div className='col-1'>Action</div>
                                    </div>
                                    <div className="event-list-container">
                                        {eventList.map(event => (
                                            <div key={event.id} className='row border align-items-center on-event-data'>
                                                <div className='col-2 d-flex ps-4'>
                                                    <div className='event-color' style={{ backgroundColor: event.color }}></div>
                                                    <span className='ms-1'>{event.creator_calendar ? event.creator_calendar : event.name}</span>
                                                </div>
                                                <div className='col-2 d-flex'>
                                                    <span className='ms-1'>{event.title}</span>
                                                </div>
                                                <div className='col-2 d-flex'>
                                                    <span>
                                                        {moment(event.start_time).format('DD-MM-YYYY')}
                                                    </span>
                                                </div>
                                                <div className='col-1 d-flex'>
                                                    <span>
                                                        {event.is_all_day ? 'All day' : moment(event.start_time).format('hh:mm')}
                                                    </span>
                                                </div>
                                                <div className='col-2'>
                                                    <span className='ms-1'>{event.creator ? event.creator : 'Me'}</span>
                                                </div>
                                                <div className='col-2'>
                                                    <span className='ms-1'>{moment(event.created_at).format('DD-MM-YYYY')}</span>
                                                </div>
                                                <div className='col-1 d-flex'>
                                                    <button
                                                        title='Restore'
                                                        className="restore-button btn btn-outline-secondary rounded-5 border-0 "
                                                        onClick={() => handleRestore(event.id)}>
                                                        <FaCheck />
                                                    </button>
                                                    <button
                                                        title='Delete'
                                                        className="delete-button btn btn-outline-secondary rounded-5 border-0 "
                                                        onClick={() => handleForceDelete(event.id)}>
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                            <div className="no-events-message ms-2">There are no incomplete events.</div>
                        )}
                    </>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );      
}
