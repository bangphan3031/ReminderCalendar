import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaTimes, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaAlignLeft, FaCalendarDay} from 'react-icons/fa';
import axiosClient from '../axios-client';
import { Dropdown} from 'react-bootstrap'
import moment from 'moment'
import { Link } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';

export default function CreateEvent(props) {
    const {selectedDate} = props;
    const [calendars, setCalendars] = useState([]);
    const [selectedCalendar, setSelectedCalendar] = useState(null);
    const [selectedCalendarId, setSelectedCalendarId] = useState(null);
    const [addingEvent, setAddingEvent] = useState(false);
    const {
        reloadEvent, 
        handleCreateSuccess, 
        setCalendarSelected,
        setSuccess, setLoading
    } = useContext(AppContext);
    const titleRef = useRef();
    const allDayRef = useRef();
    const startTimeRef = useRef();
    const endTimeRef = useRef();
    const locationRef = useRef();
    const descriptionRef = useRef();

    const date = moment(selectedDate).format('YYYY-MM-DD');
    const dateTime = moment(selectedDate).format('YYYY-MM-DDThh:mm');

    const [formData, setFormData] = useState({
        title: '',
        is_all_day: true,
        start_time: date,
        end_time: date,
        location: '',
        description: ''
    });

    useEffect(() => {
        axiosClient.get('/calendar')
            .then(response => {
                setCalendars(response.data.data);
                if (!selectedCalendar && !selectedCalendarId) {
                    setSelectedCalendar(response.data.data[0]);
                    setSelectedCalendarId(response.data.data[0].id);
                }
            })
            .catch(error => {
            console.log(error);
        });
    }, []);    

    const handleCloseClick = () => {
        props.onClose();
    };

    const handleCalendarChange = (calendar) => {
        setSelectedCalendarId(calendar.id);
        setSelectedCalendar(calendar);
        setCalendarSelected(calendar);
    };

    const handleAllDayChange = () => {
        if (allDayRef.current.checked) {
            setFormData({
                ...formData,
                is_all_day: true,
                start_time: date,
                end_time: date
            });
            startTimeRef.current.setAttribute('type', 'date');
            startTimeRef.current.value = date;
            endTimeRef.current.setAttribute('type', 'date');
            endTimeRef.current.value = date;
        } else {
            setFormData({
                ...formData,
                is_all_day: false,
                start_time: dateTime,
                end_time: dateTime
            });
            startTimeRef.current.setAttribute('type', 'datetime-local');
            startTimeRef.current.value = dateTime;
            endTimeRef.current.setAttribute('type', 'datetime-local');
            endTimeRef.current.value = dateTime;
        }
    };

    const onSubmit = (ev) => {
        ev.preventDefault()
        props.onClose();
        setLoading(true);
        const startTime = moment(startTimeRef.current.value).format('YYYY-MM-DDTHH:mm:ss');
        const endTime = moment(endTimeRef.current.value).format('YYYY-MM-DDTHH:mm:ss');
        const payload = {
            title: titleRef.current.value,
            is_all_day: allDayRef.current.checked ? 1 : 0,
            start_time: startTime,
            end_time: endTime,
            location: locationRef.current.value,
            description: descriptionRef.current.value,
            calendar_id: selectedCalendarId
        }

        axiosClient.post('/event', payload)
            .then(response => {
            const id = response.data.data.id;
            axiosClient.get(`/event/${id}`)
                .then(response => {
                    handleCreateSuccess();
                    setSuccess(true)
                    setLoading(false);
                    setTimeout(() => {
                        setSuccess(false);
                    }, 3000);
                })
                .catch(error => {
                    console.error(error);
                    setLoading(false);

                    alert('Đã có lỗi xảy ra. Vui lòng thử lại sau!');
                });
            })
            .catch(error => {
                console.error(error);
                setLoading(false);

                alert('Đã có lỗi xảy ra. Vui lòng thử lại sau!');
            });
    };

    const handleKeyDown = (ev) => {
        if (ev.keyCode === 13) {
          ev.preventDefault();
          handleSubmit(ev);
        }
    };

    return (
        <div className="create-event justify-content-center align-items-center w-100">
            <form className="create-event rounded-3" onSubmit={onSubmit} onKeyDown={handleKeyDown}>
                <header className="px-3 py-1 d-flex align-items-center">
                    <FaCalendarAlt/>
                    <b className='m-1'>Create new event</b>
                    <button
                        onClick={handleCloseClick}
                        title='Close'
                        className='close btn btn-outline-secondary border-0 rounded-5'
                    >
                        <FaTimes />
                    </button>
                </header>
                <div className="row p-3">
                    <div className="col-1"></div>
                    <div className="col">
                        <input ref={titleRef} type="text" name='title' placeholder='Add title' required
                            value={formData.title}
                            onChange={(event) => setFormData({...formData, title: event.target.value})}
                            className='form-control border-0 border-bottom text-xl font-semibold pb-2 w-100'
                        />
                    </div>
                </div>
                <div className="row p-3 pt-0">
                    <div className="col-1"></div>
                        <div className="col">
                        <input 
                            ref={allDayRef}
                            type='checkbox' 
                            className='form-check-input ml-2' 
                            style={{fontSize: 15.5, marginLeft: 10, marginRight: 5}}
                            defaultChecked
                            onChange={handleAllDayChange}
                        />
                        <label className='form-check-label all-day-checkbox-event' htmlFor='all-day-checkbox'>
                            All day
                        </label>
                    </div>
                </div>
                <div className="row p-3 pt-0">
                    <div className="col-1 pt-2"><FaClock/></div>
                    <div className="col d-flex">
                        <input ref={startTimeRef} type='date' name='start_time' required
                            value={formData.start_time}
                            onChange={(event) => setFormData({...formData, start_time: event.target.value})}
                            onBlur={() => {
                                if (formData.end_time < formData.start_time) {
                                  setFormData({ ...formData, end_time: formData.start_time });
                                }
                            }}
                            className='input-time form-control border-0 border-bottom'
                        />
                        <p className='pt-1'>_</p>
                        <input ref={endTimeRef} type='date' name='end_time' required
                            value={formData.end_time}
                            onChange={(event) => setFormData({...formData, end_time: event.target.value})}
                            min={formData.start_time}
                            className='input-time form-control border-0 border-bottom'
                        />
                    </div>
                </div>
                <div className="row p-3">
                    <div className="col-1 pt-1"><FaMapMarkerAlt/></div>
                    <div className="col">
                        <input ref={locationRef} name='location' placeholder='Location'
                            value={formData.location}
                            onChange={(event) => setFormData({...formData, location: event.target.value})}
                            className='form-control border-0 border-bottom text-xl w-100'
                        />
                    </div>
                </div>
                <div className="row p-3 pt-0">
                    <div className="col-1 pt-1"><FaAlignLeft/></div>
                    <div className="col">
                        <textarea ref={descriptionRef} name='description' placeholder='Description'
                            value={formData.description}
                            onChange={(event) => setFormData({...formData, description: event.target.value})}
                            className='form-control border-0 border-bottom text-xl w-100'
                        />
                    </div>
                </div>
                <div className="row p-3 pt-3">
                    <div className="col-1 pt-1"><FaCalendarDay/></div>
                    <div className="col">
                        <Dropdown className="dropdown-calendar">
                            <Dropdown.Toggle className='border-0 d-flex' variant="outline-secondary"> 
                                <div className='calendar-color-event' style={{backgroundColor: selectedCalendar ? selectedCalendar.color : ''}}></div>
                                <span className='ms-1'>{selectedCalendar ? selectedCalendar.name : 'Select a calendar'}</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdown-calendar-menu">
                                {calendars.map(calendar => (
                                    <Dropdown.Item 
                                        key={calendar.id}
                                        onClick={() => handleCalendarChange(calendar)}
                                        active={selectedCalendarId === calendar.id}
                                        className='d-flex'>
                                        <div className='calendar-color-event' style={{ backgroundColor: calendar.color}}></div>
                                        <span className='ms-1'>{calendar.name}</span>
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                <div className="row p-3 d-flex justify-content-end">
                    <div className="col-1"></div>
                    <div className="col-auto">
                    <Link to={`/create-event?title=${formData.title}&allday=${formData.is_all_day}&start=${formData.start_time}&end=${formData.end_time}&location=${formData.location}&description=${formData.description}`}>
                        <button className='btn btn-secondary mx-2 fw-bold' type='button'>More option</button>
                    </Link>
                        <button className='btn btn-secondary mx-2 fw-bold' type='submit'>Lưu</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

