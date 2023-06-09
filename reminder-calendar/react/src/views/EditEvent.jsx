import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaTimes, FaBell, FaClock, FaMapMarkerAlt, FaAlignLeft, FaCalendarDay} from 'react-icons/fa';
import axiosClient from '../axios-client';
import { Dropdown} from 'react-bootstrap'
import moment from 'moment'
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';

export default function EditEvent(props) {
    const { 
        handleEditSuccess,
        selectedEvent, 
        setUpdated, setLoading,
        handleCloseEventDetails,
        setSuccess,
    } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [calendars, setCalendars] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [deletedReminders, setDeletedReminders] = useState([]);
    const [addedReminders, setAddedReminders] = useState([]);
    const [deletedAttendee, setDeletedAttendee] = useState([]);
    const [addedAttendee, setAddedAttendee] = useState([]);
    const [attendees, setAttendees] = useState([]);
    const [users, setUsers] = useState([]);
    const [showUserList, setShowUserList] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [attendeeList, setAttendeeList] = useState([]);
    const [selectedUser, setSelectedUser] = useState([null]);
    const [selectedCalendar, setSelectedCalendar] = useState(null);
    const [selectedCalendarId, setSelectedCalendarId] = useState(null);
    const [isAllDay, setIsAllDay] = useState(true);
    const [timeStart, setTimeStart] = useState(null);
    const [timeEnd, setTimeEnd] = useState(null);
    const [events, setEvents] = useState([]);
    const [eventEdit, setEventEdit] = useState(null);
    const [attendeeEvents, setAttendeeEvents] = useState([]);
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
        is_all_day: true,
        start_time: '',
        end_time: '',
        location: '',
        description: '',
    }); 

    useEffect(() => {
        if(selectedEvent) {
            const allDay = selectedEvent.is_all_day == 1 ? true : false;
            setFormData({
                title: selectedEvent.title,
                is_all_day: allDay,
                start_time: allDay ? moment(selectedEvent.start_time).format('YYYY-MM-DD') : moment(selectedEvent.start_time).format('YYYY-MM-DDTHH:mm'),
                end_time: allDay ? moment(selectedEvent.end_time).format('YYYY-MM-DD') : moment(selectedEvent.end_time).format('YYYY-MM-DDTHH:mm'),
                location: selectedEvent.location,
                description: selectedEvent.description
            });
            setSelectedCalendarId(selectedEvent.calendar_id)
            setTimeStart(selectedEvent.start_time)
            setTimeEnd(selectedEvent.end_time)
            setIsAllDay(allDay)
        }
    }, [selectedEvent]);

    const dt_start = moment(timeStart).format('YYYY-MM-DDTHH:mm');
    const dt_end = moment(timeEnd).format('YYYY-MM-DDTHH:mm');
    const d_start = moment(formData.start_time).format('YYYY-MM-DD');
    const d_end = moment(formData.end_time).format('YYYY-MM-DD');

    const [inputType, setInputType] = useState('date');

    useEffect(() => {
        if (!isAllDay) {
          setInputType('datetime-local');
        } else {
          setInputType('date');
        }
    }, [isAllDay]);

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
        axiosClient.get('/calendar')
            .then(response => {
                setCalendars(response.data.data);
            })
            .catch(error => {
            console.log(error);
        });
    }, []);   

    useEffect(() => {
        if (selectedEvent != null) {
            setSelectedCalendar(selectedEvent);
        }
    }, [selectedEvent]);  

    useEffect(() => {
        const eventId = selectedEvent && selectedEvent.event_id !== null ? selectedEvent.event_id : event_id;
        
        axiosClient
            .get(`/user/${eventId}`)
            .then(response => {
                setAttendeeList(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [selectedEvent, event_id]);
      
    useEffect(() => {
        axiosClient.get('/user')
            .then(response => {
                const invitedUserIds = attendeeList.map(user => user.id);
                const filteredUsers = response.data.filter(user => !invitedUserIds.includes(user.id));
                setUsers(filteredUsers);
            })
            .catch(error => {
                console.log(error);
            });
    }, [attendeeList]);

    useEffect(() => {
        axiosClient.get(`/attendee/${event_id}`)
            .then(response => {
                setAttendees(response.data.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [event_id]);

    const handleUserClick = (user) => {
        const isDeletedAttendee = deletedAttendee.find(attendee => attendee.user_id === user.id);
        if (!isDeletedAttendee) {
            setAttendeeList([...attendeeList, user]);
            setShowUserList(false);
            setSearchKeyword('');
            setAddedAttendee([...addedAttendee, user]);
        } else {
            const updatedDeletedAttendee = deletedAttendee.filter(attendee => attendee.user_id !== user.id);
            setDeletedAttendee(updatedDeletedAttendee);
            setAttendeeList([...attendeeList, user]);
            setShowUserList(false);
            setSearchKeyword('');
        }
    };
      
    const handleDeleteClick = (user) => {
        const deletedAttendees = attendees.filter(attendee => attendee.user_id === user.id);
        setAttendeeList(attendeeList.filter((u) => u.id !== user.id));
        setUsers([...users, user]);
        setAddedAttendee(addedAttendee.filter((u) => u.id !== user.id));
        setDeletedAttendee([...deletedAttendee, ...deletedAttendees ]);
    }

    const handleAddReminderClick = () => {
        const newReminder = {
          method: 'Email',
          time: 10,
          kind_of_time: 'minutes',
        };
        setReminders([...reminders, newReminder]);
        setAddedReminders([...addedReminders, newReminder]);
    };

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
        handleCloseEventDetails()
        handleEditSuccess();
    };
    
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
        const isChecked = allDayRef.current.checked;
        setIsAllDay(isChecked);
        if (isChecked) {
            setFormData({
                ...formData,
                is_all_day: true,
                start_time: d_start,
                end_time: d_end
            });
            startTimeRef.current.setAttribute('type', 'date');
            startTimeRef.current.value = d_start;
            endTimeRef.current.setAttribute('type', 'date');
            endTimeRef.current.value = d_end;
        } else {
            setFormData({
                ...formData,
                is_all_day: false,
                start_time: dt_start,
                end_time: dt_end
            });
            startTimeRef.current.setAttribute('type', 'datetime-local');
            startTimeRef.current.value = dt_start;
            endTimeRef.current.setAttribute('type', 'datetime-local');
            endTimeRef.current.value = dt_end;
        }
    };

    const onSubmit = async (ev) => {
        ev.preventDefault()
        navigate(-1);
        handleCloseEventDetails()
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
        try {
            const eventResponse = await axiosClient.put(`/event/${event_id}`, payload)
            
            const deleteReminderPromises = deletedReminders.map((id) => {
                if(id){
                    axiosClient.delete(`/reminder/${id}`)
                    .then(response => {
                        console.log(response.data)
                    })
                    .catch(error => {
                        console.log(error);
                    });
                }
            });
            const reminderPromises = addedReminders.map(async (reminder) => {
                try {
                    const response = await axiosClient.post(`/reminder/${event_id}`, reminder);
                    console.log(response.data);
                    const sendReminderResponse = await axiosClient.get(`/sendReminder/${response.data.data.id}`);
                    console.log(sendReminderResponse.data);
                } catch (error) {
                    console.log(error);
                }
            });

            const deleteAttendeePromises = deletedAttendee.map(async (attendee) => {
                try {
                    const response = await axiosClient.delete(`/attendee/${attendee.id}`);
                    console.log(response.data);
                } catch (error) {
                    console.log(error);
                }
            });

            let shouldDisplayPrompt = true;
            let shouldSendInvite = null;
          
            const attendeePromises = addedAttendee.map(async (attendee) => {
                try {
                    const response = await axiosClient.post(`/attendee/${event_id}`, { user_id: attendee.id });
                    console.log(response.data);
                    if (shouldDisplayPrompt) {
                        const confirm = window.confirm('Bạn có muốn gửi email thông báo đến các attendee không?');
                        shouldSendInvite = confirm;
                        shouldDisplayPrompt = false; 
                    }
                    if (shouldSendInvite) {
                        const sendInvite = await axiosClient.get(`/sendInvite/${response.data.data.id}`);
                        console.log(sendInvite.data);
                    }
                } catch (error) {
                    console.log(error);
                }
            });
            
            await Promise.all([...deleteReminderPromises, ...reminderPromises, ...deleteAttendeePromises, ...attendeePromises]);
            setUpdated(true)
            setLoading(false);
            handleEditSuccess();
            setTimeout(() => {
                setUpdated(false)
            }, 3000);

        } catch (error) {
            console.log(error);
            setLoading(false);
            alert('Đã có lỗi xảy ra. Vui lòng thử lại sau!');
        }
            
    };

    useEffect(() => {
        axiosClient.get('/event')
            .then(response => {
                const filteredEvents = response.data.data.filter(event => event.id !== parseInt(event_id));
                setEvents(filteredEvents);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        axiosClient.get(`/event/${event_id}`)
            .then(response => {
                console.log(response.data.data); 
                const newEventEdit = response.data.data.event_id;
                setEventEdit(newEventEdit);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const checkEventConflict = (start, end) => {
        return events.some(event => {
            if (event.is_all_day === 1) {
                const eventDate = moment(event.start_time).format('YYYY-MM-DD');
                const inputDate = moment(start).format('YYYY-MM-DD');
                return inputDate === eventDate;
            } else {
                const eventStart = moment(event.start_time).format('YYYY-MM-DDTHH:mm:ss');
                const eventEnd = moment(event.end_time).format('YYYY-MM-DDTHH:mm:ss');
                let startTime, endTime;
      
                if (allDayRef.current.checked) {
                    startTime = moment(start).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
                    endTime = moment(end).endOf('day').format('YYYY-MM-DDTHH:mm:ss');
                } else {
                    startTime = moment(start).format('YYYY-MM-DDTHH:mm:ss');
                    endTime = moment(end).format('YYYY-MM-DDTHH:mm:ss');
                }
      
                return (
                    (startTime >= eventStart && startTime <= eventEnd) ||
                    (endTime >= eventStart && endTime <= eventEnd) ||
                    (startTime <= eventStart && endTime >= eventEnd)
                );
            }
        });
    }; 

    const fetchAttendeeEvents = async () => {
        try {
            const promises = attendeeList.map((attendee) =>
                axiosClient.get(`/event/user/${attendee.id}`)
            );
            const responses = await Promise.all(promises);
            const attendeeEventData = responses.map((response) => response.data.data);

            const filteredAttendeeEventData = attendeeEventData.map((events) => {
                return events.filter((event) => {
                    if (eventEdit != null) {
                        return event.event_id != eventEdit;
                    } else {
                        return event.event_id != event_id;
                    }
                });
            });

            setAttendeeEvents(filteredAttendeeEventData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAttendeeEvents();
    }, [attendeeList, eventEdit]);

    const renderAttendeeList = () => {
        return attendeeList.map((attendee, index) => {
            const attendeeEventData = attendeeEvents[index] || [];
            const hasConflict =
                formData.start_time &&
                formData.end_time &&
                attendeeEventData &&
                checkAttendeeEventConflict(
                    formData.start_time,
                    formData.end_time,
                    attendeeEventData
                );
            return (
                <li key={attendee.id} title={attendee.email}>
                    <div>
                        {hasConflict && (
                            <p className="text-danger m-0">Người dùng đã bận</p>
                        )}
                        <p className="attendee-name m-0">{attendee.name}</p>
                    </div>
                    <button
                        type="button"
                        className="btn btn-outline-secondary border-0"
                        onClick={() => handleDeleteClick(attendee)}
                        disabled={selectedEvent && selectedEvent.event_id !== null}
                    >
                        <FaTimes />
                    </button>
                </li>
            );
        });
    };

    const checkAttendeeEventConflict = (start, end, attendeeEvents) => {
        return attendeeEvents.some(event => {
            if (event.is_all_day === 1) {
                const eventDate = moment(event.start_time).format('YYYY-MM-DD');
                const inputDate = moment(start).format('YYYY-MM-DD');
                return inputDate === eventDate;
            } else {
                const eventStart = moment(event.start_time).format('YYYY-MM-DDTHH:mm:ss');
                const eventEnd = moment(event.end_time).format('YYYY-MM-DDTHH:mm:ss');
                let startTime, endTime;
        
                if (allDayRef.current.checked) {
                    startTime = moment(start).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
                    endTime = moment(end).endOf('day').format('YYYY-MM-DDTHH:mm:ss');
                } else {
                    startTime = moment(start).format('YYYY-MM-DDTHH:mm:ss');
                    endTime = moment(end).format('YYYY-MM-DDTHH:mm:ss');
                }
        
                const isConflict =
                (startTime >= eventStart && startTime <= eventEnd) ||
                (endTime >= eventStart && endTime <= eventEnd) ||
                (startTime <= eventStart && endTime >= eventEnd);
        
                return isConflict;
            }
        });
    };
      
    const hasAttendeeConflict = () => {
        return attendeeList.some((attendee, index) => {
            const attendeeEventData = attendeeEvents[index] || [];
            return checkAttendeeEventConflict(formData.start_time, formData.end_time, attendeeEventData);
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
                                        value={formData.title ? formData.title : ''}
                                        onChange={(event) => setFormData({...formData, title: event.target.value})}
                                        className='title-event-input form-control border-0 border-bottom'
                                        disabled={selectedEvent && selectedEvent.event_id !== null}
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
                                        checked={isAllDay}
                                        onChange={handleAllDayChange}
                                        disabled={selectedEvent && selectedEvent.event_id !== null}
                                    />
                                    <label className='form-check-label' htmlFor='all-day-checkbox'>
                                        All day
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className='row ps-5'  style={{marginLeft: "10px"}}>
                            {checkEventConflict(formData.start_time, formData.end_time) && (
                            <span className="text-danger ps-3">
                                Thời gian trùng với một sự kiện đã tồn tại!
                            </span>
                            )}
                        </div>
                        <div className="row p-3 pt-0">
                            <div className="col-1 pt-2">
                                <div className='icons'>
                                    <FaClock/>
                                </div>
                            </div>
                            <div className="col d-flex">
                                <input ref={startTimeRef} type={inputType} name='start_time' required
                                    value={formData.start_time ? formData.start_time  : ''}
                                    onChange={(event) => setFormData({...formData, start_time: event.target.value})}
                                    onBlur={() => {
                                        if (formData.end_time < formData.start_time) {
                                          setFormData({ ...formData, end_time: formData.start_time });
                                        }
                                    }}
                                    className='event-input input-time form-control border-0 border-bottom'
                                    disabled={selectedEvent && selectedEvent.event_id !== null}
                                />
                                <div>
                                    <p className='lable-to pt-2'>to</p>
                                </div>
                                <input ref={endTimeRef} type={inputType} name='end_time' required
                                    value={formData.end_time ? formData.end_time  : ''}
                                    onChange={(event) => setFormData({...formData, end_time: event.target.value})}
                                    min={formData.start_time}
                                    className='event-input input-time form-control border-0 border-bottom'
                                    disabled={selectedEvent && selectedEvent.event_id !== null}
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
                                        value={formData.location ? formData.location : ''}
                                        onChange={(event) => setFormData({...formData, location: event.target.value})}
                                        className='event-input form-control border-0 border-bottom text-xl w-100'
                                        disabled={selectedEvent && selectedEvent.event_id !== null}
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
                                        Add reminder
                                    </button>
                                </div>
                            </div>
                            <div>
                                {reminders.map((reminder, index) => (
                                    <div className="row p-3 pt-0" key={index}>
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
                                        <Dropdown.Toggle className='calendar-dropdown-toggle border-0 d-flex' variant="outline-secondary" id="dropdown-secondary"> 
                                            <div className='calendar-color-event' style={{backgroundColor: selectedCalendar ? selectedCalendar.color : ''}}></div>
                                            <span className='ms-1'>{selectedCalendar ? selectedCalendar.name : 'Select a calendar'}</span>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="dropdown-menu">
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
                            <div className="row p-3 pt-0">
                                <div className="col-1 pt-1">
                                    <div className='icons'>
                                        <FaAlignLeft/>
                                    </div> 
                                </div>
                                <div className="col">
                                    <textarea ref={descriptionRef} name='description' placeholder='Add description'
                                        value={formData.description ? formData.description : ''}
                                        onChange={(event) => setFormData({...formData, description: event.target.value})}
                                        className='event-input-area form-control border-0 border-bottom text-xl w-100'
                                        disabled={selectedEvent && selectedEvent.event_id !== null}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-6'>
                        <div className="row p-1">
                            <div className="col-11">
                                <button className='submit-event-button btn btn-primary fw-bold' 
                                    type='submit'
                                    disabled={checkEventConflict(formData.start_time, formData.end_time) || hasAttendeeConflict()}
                                >
                                    Save
                                </button>
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
                                    <input
                                        type="text"
                                        placeholder='Add attendee'
                                        className='form-control'
                                        onClick={handleInputClick}
                                        value={searchKeyword}
                                        onChange={handleSearchChange}
                                        disabled={selectedEvent && selectedEvent.event_id !== null}
                                    />
                                    {showUserList && (
                                        <div ref={userListRef} className='user-list'>
                                            {filteredUsers.map((attendee) => (
                                                <div key={attendee.id} onClick={() => handleUserClick(attendee)}>
                                                {attendee.name} - {attendee.email}
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
                                                {renderAttendeeList()}
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
