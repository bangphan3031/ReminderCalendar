import React, { useContext, useEffect, useState } from 'react';
import axiosClient from '../axios-client';
import moment from 'moment';
import { FaTrash, FaTimes, FaPrint } from 'react-icons/fa';
import { Watch } from 'react-loader-spinner'
import { AppContext } from '../contexts/AppContext';
import Loading from './Loading';
import { Link } from 'react-router-dom';
import SubLayoutHeader from './SubLayoutHeader';

export default function SearchEvent() {
    const [eventList, setEventList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [reloadEvent, setReloadEvent] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [calendarId, setCalendarId] = useState('');
    const [status, setStatus] = useState('');
    const [calendars, setCalendars] = useState('');
    const [count, setCount] = useState(0);
    const { 
        loading, 
        setIsLoadingData,
        setLoading, 
        success, setSuccess,
        deleted, setDeleted,
    } = useContext(AppContext);

    const handleClose = () => {
        setDeleted(false);
        setSuccess(false);
    };

    useEffect(() => {
        const fetchCalendars = async () => {
            try {
                const response = await axiosClient.get('/calendar');
                const data = await response.data.data;
                setCalendars(data);
            } catch (error) {
                console.error('Error fetching calendars:', error);
            }
        };

        fetchCalendars();
    }, []);

    const handleSearch = async () => {
        setInitialLoad(true);
        setIsLoading(true);
        const payload = {
            keyword: keyword,
            startTime: startTime,
            endTime: endTime,
            calendarId: calendarId,
            status: status
        };

        try {
            const response = await axiosClient.post('/events/search', payload);
            setEventList(response.data.data);
            setReloadEvent(false);
            setIsLoading(false);
            setIsLoadingData(false);
            setCount(response.data.data.length);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    function handleExportEvent() {
        axiosClient.post('/search-event/export', null, { responseType: 'blob' })
        .then(response => {
            const blobUrl = URL.createObjectURL(response.data);
            const downloadLink = document.createElement('a');
            downloadLink.href = blobUrl;
            downloadLink.download = 'export_events.xlsx';
            downloadLink.click();
            URL.revokeObjectURL(blobUrl);
        })
        .catch(error => {
            console.log(error)
        });
    }
    
    const handleDelete = (eventId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa công việc này không?')) {
            setLoading(true);
            axiosClient.delete(`/event/${eventId}`)
            .then((response) => {
                console.log(response.data);
                setDeleted(true)
                setLoading(false)
                setEventList(eventList.filter(event => event.id !== eventId));
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
                            <div className="row mb-2 mt-2 sidebar-title-row-choose">
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
                            <div className="row mt-2 mb-2 sidebar-title-row">
                                <div className='ms-3 mt-2 mb-2'>
                                    Incomplete Events
                                </div>
                            </div>
                        </Link>
                        <Link to="/trash" className='text-decoration-none text-secondary'>
                            <div className="row mt-2 mb-2 sidebar-title-row">
                                <div className='ms-3 mt-2 mb-2'>
                                    Trash
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col">
                        <div className="d-flex mt-1 text-secondary ms-2 mt-3 mb-2">
                            <h4 className='mt-2 mb-2'>Search Event</h4>
                            <div className="search-container ms-5 mt-1">
                                <div className="input-group search-input-container">
                                    <select
                                        className="form-control search-input custom-search-input"
                                        style={{ width: "25%" }}
                                        value={calendarId}
                                        onChange={(e) => setCalendarId(e.target.value)}
                                    >
                                        <option value=""> All calendar </option>
                                        {Array.isArray(calendars) && calendars.length > 0 ? (
                                            calendars.map((calendar) => (
                                                <option key={calendar.id} value={calendar.id}>
                                                    {calendar.name}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="">No calendars available</option>
                                        )}
                                    </select>
                                    <input
                                        type="date"
                                        className="form-control search-input custom-search-input"
                                        style={{ width: "20%" }}
                                        placeholder="Enter start time..."
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    />
                                    <input
                                        type="date"
                                        className="form-control search-input custom-search-input"
                                        style={{ width: "20%" }}
                                        placeholder="Enter end time..."
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                    />
                                    <select
                                        className="form-control search-input custom-search-input"
                                        style={{ width: "20%" }}
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="" className='text-secondary'> All status </option>
                                        <option value="completed">Completed</option>
                                        <option value="incomplete">Incomplete</option>
                                    </select>
                                </div>
                                <div className="input-group search-input-container">
                                    <input
                                        type="search"
                                        className="form-control search-input custom-search-input"
                                        placeholder="Title"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                    />
                                    <button className="btn btn-primary search-button" onClick={handleSearch}>
                                        Search
                                    </button>
                                </div>
                            </div>
                            <button className='clear-all-trash-button btn btn-outline-secondary rounded-2 border-0 mt-1 ms-1 mb-1'
                                onClick={handleExportEvent}
                            >
                            <div className="d-flex">
                                <div className='clear-trash-icon'><FaPrint /></div>
                                <div className='clear-trash-lable ms-2'><span>Export file</span></div>
                            </div>
                            </button>
                        </div>
                        <div className="no-events-message ms-2">Result: {count}</div>
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
                                        <div className='col-2'>Status</div>
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
                                                    <span className='ms-1'>{event.status}</span>
                                                </div>
                                                <div className='col-1'>
                                                    <button
                                                        title='Move to trash'
                                                        className="delete-button btn btn-outline-secondary rounded-5 border-0 "
                                                        onClick={() => handleDelete(event.id)}>
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                            <div/>
                        )}
                    </>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );        
}
