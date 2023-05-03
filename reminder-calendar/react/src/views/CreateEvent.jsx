import React, { useEffect, useRef, useState } from 'react';
import { FaTimes, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaAlignLeft, FaCalendarDay} from 'react-icons/fa';
import axiosClient from '../axios-client';
import { Dropdown} from 'react-bootstrap'
import moment from 'moment'

export default function CreateEvent(props) {
    const [calendars, setCalendars] = useState([]);
    const [selectedCalendar, setSelectedCalendar] = useState(null);
    const [selectedCalendarId, setSelectedCalendarId] = useState(null);
    const titleRef = useRef();
    const allDayRef = useRef();
    const startTimeRef = useRef();
    const endTimeRef = useRef();
    const locationRef = useRef();
    const descriptionRef = useRef();

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
    };

    const handleAllDayChange = () => {
        if (allDayRef.current.checked) {
            startTimeRef.current.type = 'date';
            endTimeRef.current.type = 'date';
        } else {
            startTimeRef.current.type = 'datetime-local';
            endTimeRef.current.type = 'datetime-local';
        }
      };

    const onSubmit = (ev) => {
        ev.preventDefault()
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
                alert('Thêm mới công việc thành công')
                window.location.reload()
            })
            .catch(error => {
                console.error(error);
                alert('Đã có lỗi xảy ra. Vui lòng thử lại sau!');
            });
    // Gửi các giá trị form đến API hoặc hệ thống lưu trữ dữ liệu của bạn để tạo sự kiện mới.
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
                        <label className='form-check-label all-day-checkbox' htmlFor='all-day-checkbox'>
                            All day
                        </label>
                    </div>
                </div>
                <div className="row p-3 pt-0">
                    <div className="col-1 pt-2"><FaClock/></div>
                    <div className="col d-flex">
                        <input ref={startTimeRef} type='date' name='start_time' required
                            className='input-time form-control border-0 border-bottom'
                        />
                        <p className='pt-1'>_</p>
                        <input ref={endTimeRef} type='date' name='end_time' required
                            className='input-time form-control border-0 border-bottom'
                        />
                    </div>
                </div>
                <div className="row p-3">
                    <div className="col-1 pt-1"><FaMapMarkerAlt/></div>
                    <div className="col">
                        <input ref={locationRef} name='location' placeholder='Location'
                            className='form-control border-0 border-bottom text-xl w-100'
                        />
                    </div>
                </div>
                <div className="row p-3 pt-0">
                    <div className="col-1 pt-1"><FaAlignLeft/></div>
                    <div className="col">
                        <textarea ref={descriptionRef} name='description' placeholder='Description'
                            className='form-control border-0 border-bottom text-xl w-100'
                        />
                    </div>
                </div>
                <div className="row p-3 pt-3">
                    <div className="col-1 pt-1"><FaCalendarDay/></div>
                    <div className="col">
                        <Dropdown className="dropdown-time">
                            <Dropdown.Toggle className='border-0' variant="outline-secondary" id="dropdown-secondary"> 
                                {selectedCalendar ? selectedCalendar.name : 'Select a calendar'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdown-menu">
                                {calendars.map(calendar => (
                                    <Dropdown.Item 
                                    key={calendar.id}
                                    onClick={() => handleCalendarChange(calendar)}
                                    active={selectedCalendarId === calendar.id}> 
                                    {calendar.name}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                <div className="row p-3 d-flex justify-content-end">
                    <div className="col-1"></div>
                    <div className="col-auto">
                        <button className='btn btn-secondary mx-2 fw-bold' type='button'>More option</button>
                        <button className='btn btn-secondary mx-2 fw-bold' type='submit'>Lưu</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

