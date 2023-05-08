import React, { useEffect, useRef, useState } from 'react';
import { FaTimes, FaBell, FaClock, FaMapMarkerAlt, FaAlignLeft, FaCalendarDay} from 'react-icons/fa';
import axiosClient from '../axios-client';
import { Dropdown} from 'react-bootstrap'
import moment from 'moment'
import { useLocation, useNavigate } from 'react-router-dom';

export default function EditEvent(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const [calendars, setCalendars] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [deletedReminders, setDeletedReminders] = useState([]);
    const [addedReminders, setAddedReminders] = useState([]);
    const [users, setUsers] = useState([]);
    const [showUserList, setShowUserList] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [attendeeList, setAttendeeList] = useState([]);
    const [selectedUser, setSelectedUser] = useState([null]);
    const [selectedCalendar, setSelectedCalendar] = useState(null);
    const [selectedCalendarId, setSelectedCalendarId] = useState(null);
    const userListRef = useRef(null);
    const titleRef = useRef();
    const allDayRef = useRef();
    const startTimeRef = useRef();
    const endTimeRef = useRef();
    const locationRef = useRef();
    const descriptionRef = useRef();

    const searchParams = new URLSearchParams(location.search);
    const event_id = searchParams.get('id');

    const [formData, setFormData] = useState({
        title: '',
        is_all_day: '',
        start_time: '',
        end_time: '',
        location: '',
        description: '',
    });

    useEffect(() => {
        axiosClient.get(`/event/${event_id}`)
            .then(response => {
                setFormData({
                    title: response.data.data.title,
                    is_all_day: response.data.data.is_all_day,
                    start_time: moment(response.data.data.start_time).format('YYYY-MM-DD'),
                    end_time: moment(response.data.data.end_time).format('YYYY-MM-DD'),
                    location: response.data.data.location,
                    description: response.data.data.description
                });
                setSelectedCalendarId(response.data.data.calendar_id)
            })
            .catch(error => {
            console.log(error);
            });
    }, []);  

    useEffect(() => {
        axiosClient.get(`/reminder/${event_id}`)
          .then(response => {
                setReminders(response.data.data);
          })
          .catch(error => {
                console.log(error);
          });
    }, [event_id]);

    useEffect(() => {
        axiosClient.get(`/user/${event_id}`)
            .then(response => {
                setAttendeeList(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [event_id]);

    useEffect(() => {
        axiosClient.get('/calendar')
            .then(response => {
                setCalendars(response.data.data);
            })
            .catch(error => {
            console.log(error);
        });
    }, []);   

    useEffect(() => {
        if (selectedCalendarId != null) {
          axiosClient.get(`/calendar/${selectedCalendarId}`)
            .then(response => {
                setSelectedCalendar(response.data.data);
            })
            .catch(error => {
                console.log(error);
            });
        }
    }, [selectedCalendarId]);  

    useEffect(() => {
        axiosClient.get('/user')
          .then(response => {
            setUsers(response.data);
          })
          .catch(error => {
            console.log(error);
          });
    }, []); 

    const handleAddReminderClick = () => {
        const newReminder = {
          method: 'Email',
          time: 10,
          kind_of_time: 'minutes',
        };
        setReminders([...reminders, newReminder]);
        setAddedReminders([...addedReminders, newReminder]);
    };
    // console.log('reminder', reminders)
    // console.log('add', addedReminders)

    const handleDeleteReminderClick = (index) => {
        const reminderToDelete = reminders[index];
        const newReminders = reminders.filter((_, i) => i !== index);
        setReminders(newReminders);
        if (addedReminders.some(r => r === reminderToDelete)) {
            const updatedAddedReminders = addedReminders.filter(r => r !== reminderToDelete);
            setAddedReminders(updatedAddedReminders);
        }
        setDeletedReminders([...deletedReminders, reminderToDelete.id]);
    };

    const handleCloseClick = () => {
        navigate(-1);
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setAttendeeList([...attendeeList, user]);
        setShowUserList(false);
        setUsers(users.filter((u) => u.id !== user.id));
        setSearchKeyword('');
    };

    function handleDeleteClick(user) {
        setAttendeeList(attendeeList.filter((u) => u.id !== user.id));
        setUsers([...users, user]);
    }
    
    const handleInputClick = () => {
        setShowUserList(true);
    };

    const handleOutsideClick = (e) => {
        if (userListRef.current && !userListRef.current.contains(e.target)) {
            setShowUserList(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleSearchChange = (event) => {
        setSearchKeyword(event.target.value);
    };

    const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchKeyword.toLowerCase()));

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
        axiosClient.put(`/event/${event_id}`, payload)
            .then(response => {
                alert('Cập nhật công việc thành công')
                navigate(-1)
            })
            .catch(error => {
                console.log(error);
            });
            deletedReminders.forEach((id) => {
                axiosClient.delete(`/reminder/${id}`)
                .then(response => {
                    alert('Xóa reminder thành công')
                })
                .catch(error => {
                    console.log(error);
                });
            });
            const reminderPromises = addedReminders.map(async (reminder) => {
                try {
                    const response = await axiosClient.post(`/reminder/${event_id}`, reminder);
                    console.log(response.data);
                    alert('Thêm reminder thành công')
                } catch (error) {
                    console.log(error);
                }
            });

    };

    const handleKeyDown = (ev) => {
        if (ev.keyCode === 13) {
          ev.preventDefault();
          handleSubmit(ev);
        }
    };

    return (
        <div className="">
            <form className="edit-event-form" onSubmit={onSubmit} onKeyDown={handleKeyDown}>
                <div className='row'>
                    <div className='col-6 edit-calendar'>
                        <div className="row p-3">
                            <div className="col-1">
                                <div>
                                    <button
                                        type='button'
                                        onClick={handleCloseClick}
                                        title='Cancel event create'
                                        className='cancel-button btn btn-outline-secondary border-0 rounded-5'
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            </div>
                            <div className="col">
                                <div>
                                    <input ref={titleRef} type="text" name='title' placeholder='Add title' required
                                        value={formData.title}
                                        onChange={(event) => setFormData({...formData, title: event.target.value})}
                                        className='title-event-input form-control border-0 border-bottom'
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row p-3 pt-0">
                            <div className="col-1"></div>
                            <div className="col">
                                <div className='all-day-checkbox'>
                                    <input 
                                        ref={allDayRef}
                                        type='checkbox' 
                                        className='form-check-input' 
                                        style={{fontSize: 15.5, marginLeft: 10, marginRight: 5}}
                                        defaultChecked
                                        onChange={handleAllDayChange}
                                    />
                                    <label className='form-check-label' htmlFor='all-day-checkbox'>
                                        All day
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="row p-3 pt-0">
                            <div className="col-1 pt-2">
                                <div className='icons'>
                                    <FaClock/>
                                </div>
                            </div>
                            <div className="col d-flex">
                                <input ref={startTimeRef} type='date' name='start_time' required
                                    value={formData.start_time}
                                    onChange={(event) => setFormData({...formData, start_time: event.target.value})}
                                    className='event-input input-time form-control border-0 border-bottom'
                                />
                                <div>
                                    <p className='lable-to pt-2'>to</p>
                                </div>
                                <input ref={endTimeRef} type='date' name='end_time' required
                                    value={formData.end_time}
                                    onChange={(event) => setFormData({...formData, end_time: event.target.value})}
                                    className='event-input input-time form-control border-0 border-bottom'
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-1"></div>
                            <div className="col">
                                <p className='event-detail-lable border-bottom'>Event detail</p>
                            </div>
                        </div>
                        <div className='event-detail-form'>
                            <div className="row p-3 pt-0">
                                <div className="col-1 pt-1">
                                    <div className='icons'>
                                        <FaMapMarkerAlt/>   
                                    </div>
                                </div>
                                <div className="col pt-1">
                                    <input ref={locationRef} name='location' placeholder='Add location'
                                        value={formData.location}
                                        onChange={(event) => setFormData({...formData, location: event.target.value})}
                                        className='event-input form-control border-0 border-bottom text-xl w-100'
                                    />
                                </div>
                            </div>
                            <div className="row p-3 pt-0">
                                <div className="col-1 pt-1">
                                    <div className="icons">
                                        <FaBell />
                                    </div>
                                </div>
                                <div className="col">
                                    <button
                                        className="reminder-button btn btn-outline-secondary fw-bold border-0"
                                        type="button"
                                        onClick={handleAddReminderClick}
                                        >
                                        Thêm nhắc nhở
                                    </button>
                                </div>
                            </div>
                            <div>
                                {reminders.map((reminder, index) => (
                                    <div className="row p-3 pt-0" key={reminder.id}>
                                        <div className="col-1 pt-1"></div>
                                        <div className="col-7">
                                            <div className="input-group">
                                                <div>
                                                    <select className="reminder-select form-select" 
                                                        defaultValue={reminder.method}
                                                        onChange={(event) => {
                                                            const newMethod = event.target.value;
                                                            const newReminders = [...reminders];
                                                            newReminders[index].method = newMethod;
                                                            setReminders(newReminders);
                                                        }}
                                                    >
                                                        <option value="Email">Email</option>
                                                        <option value="Zalo">Zalo</option>
                                                        <option value="Sms">Sms</option>
                                                    </select>
                                                </div>
                                                <div>
                                                <input
                                                    type="number"
                                                    className="reminder-time form-control"
                                                    defaultValue={reminder.time}
                                                    onChange={(event) => {
                                                        const newTime = Number(event.target.value);
                                                        const newReminders = [...reminders];
                                                        newReminders[index].time = newTime;
                                                        setReminders(newReminders);
                                                    }}
                                                />
                                                </div>
                                                <div>
                                                    <select
                                                        className="reminder-select form-select"
                                                        defaultValue={reminder.kind_of_time}
                                                        onChange={(event) => {
                                                            const newKindOfTime = event.target.value;
                                                            const newReminders = [...reminders];
                                                            newReminders[index].kind_of_time = newKindOfTime;
                                                            setReminders(newReminders);
                                                        }}
                                                    >
                                                        <option value="days">Days</option>
                                                        <option value="hours">Hours</option>
                                                        <option value="minutes">Minutes</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <button
                                                        type="button"
                                                        className="button-close-reminder btn btn-outline-secondary border-0 "
                                                        onClick={() => handleDeleteReminderClick(index)}>
                                                        <FaTimes />
                                                    </button>
                                                </div>  
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="row p-3 pt-0">
                                <div className="col-1 pt-1">              
                                    <div className='icons'>
                                        <FaCalendarDay/> 
                                    </div>
                                </div>
                                <div className="col">
                                    <Dropdown className="dropdown-calendar">
                                        <Dropdown.Toggle className='calendar-dropdown-toggle border-0' variant="outline-secondary" id="dropdown-secondary"> 
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
                            <div className="row p-3 pt-0">
                                <div className="col-1 pt-1">
                                    <div className='icons'>
                                        <FaAlignLeft/>
                                    </div> 
                                </div>
                                <div className="col">
                                    <textarea ref={descriptionRef} name='description' placeholder='Add description'
                                        value={formData.description}
                                        onChange={(event) => setFormData({...formData, description: event.target.value})}
                                        className='event-input-area form-control border-0 border-bottom text-xl w-100'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-6'>
                        <div className="row p-1">
                            <div className="col-11">
                                <button className='submit-event-button btn btn-primary fw-bold' type='submit'>Lưu</button>
                            </div>
                        </div> 
                        <div className="row">
                            <div className="col-11">
                                <p className='attendee-lable border-bottom w-50'>Attendee</p>
                            </div>
                        </div> 
                        <div className="row">
                            <div className="col-11 pt-1 add-attendee">
                                <div className='dropdown'>
                                    <input type="text" placeholder='Add attendee' 
                                        className='form-control'
                                        onClick={handleInputClick} 
                                        value={searchKeyword} onChange={handleSearchChange}/>
                                    {showUserList && (
                                        <div ref={userListRef} className='user-list'>
                                        {filteredUsers.map((user) => (
                                            <div key={user.id} onClick={() => handleUserClick(user)}>
                                                {user.name} - {user.email}
                                            </div>
                                        ))}
                                        </div>
                                    )}
                                    {attendeeList.length > 0 && (
                                        <div>
                                            <div className='attendee-list-lable'>
                                                <p className='pt-3'>Attendee List:</p>
                                            </div>
                                            <ul className='attendee-list'>
                                                {attendeeList.map((attendee) => (
                                                <li key={attendee.id} title={attendee.email}>
                                                    {attendee.name}
                                                    <button type='button' 
                                                        className='btn btn-outline-secondary border-0'
                                                        onClick={() => handleDeleteClick(attendee)}>
                                                        <FaTimes/>
                                                    </button>
                                                </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>   
                    </div>
                </div>
            </form>
        </div>
    )
}
