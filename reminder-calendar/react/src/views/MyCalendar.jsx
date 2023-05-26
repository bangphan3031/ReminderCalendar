import React, { useState, useEffect, useContext } from 'react';
import axiosClient from '../axios-client';
import axios from 'axios';
import { Form, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaTrash, FaPlus, FaEdit, FaTimes, FaAngleDown, FaAngleUp } from 'react-icons/fa';
import CreateCalendar from './CreateCalendar';
import EditCalendar from './EditCalendar';
import { AppContext } from '../contexts/AppContext';
import Loading from './Loading';
import moment from 'moment';

export default function MyCalendar(props) {
  const [data, setData] = useState([]);
  const [showCreateCalendar, setShowCreateCalendar] = useState(false);
  const [showEditCalendar, setShowEditCalendar] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState(null);
  const [reloadCalendar, setReloadCalendar] = useState(false);
  const { 
    loading, 
    setLoading, 
    success, setSuccess, 
    deleted, setDeleted, 
    eventList, 
    setEventList, 
    addEvent, 
    removeEventsByCalendarId, 
    handleDeleteSuccess,
    handleShowEventDetails, 
    setSelectedEvent
  } = useContext(AppContext);
  const [events, setEvents] = useState([]);
  const [buttonStates, setButtonStates] = useState(() => {
    const initialButtonStates = {};
    data.forEach(calendar => {
      initialButtonStates[calendar.id] = false;
    });
    return initialButtonStates;
  });
  const [eventListVisible, setEventListVisible] = useState({});

  const [checkedBoxes, setCheckedBoxes] = useState(() => {
    try {
      const storedState = localStorage.getItem("checkedBoxes");
      return storedState ? JSON.parse(storedState) : {};
    } catch (error) {
      console.log("Error parsing localStorage data:", error);
      return {};
    }
  });

  useEffect(() => {
    const fetchEvents = async (calendarId) => {
      try {
        const response = await axiosClient.get(`/event/calendar/${calendarId}`);
        setEvents(prevEvents => ({
          ...prevEvents,
          [calendarId]: response.data.data
        }));
      } catch (error) {
        console.log(`Error fetching events for calendar ${calendarId}:`, error);
      }
    };

    // Fetch events for each calendar
    data.forEach(calendar => {
      fetchEvents(calendar.id);
    });
  }, [data]);

  const handleCreateCalendarClick = () => {
    setShowCreateCalendar(true);
  };

  const handleEditCalendarClick = (calendar) => {
    setEditingCalendar(calendar);
    setShowEditCalendar(true);
  };

  const handleCreateSuccess = () => {
    setReloadCalendar(true);
  };

  const handleToggleEventList = (calendarId) => {
    setButtonStates(prevStates => ({
      ...prevStates,
      [calendarId]: !prevStates[calendarId]
    }));
  
    setEventListVisible(prevState => ({
      ...prevState,
      [calendarId]: !prevState[calendarId]
    }));
  };

  const handleSelectEvent = event => {
    setSelectedEvent(event);
    handleShowEventDetails();
  };

  const handleClose = () => {
    setShowCreateCalendar(false);
    setShowEditCalendar(false);
    setSuccess(false);
    setDeleted(false);
  };

  const handleDeleteCalendar = (calendarId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch này không?')) {
      setLoading(true);
      axiosClient.delete(`/calendar/${calendarId}`)
        .then(response => {
          setDeleted(true)
          setLoading(false)
          setData(data.filter(calendar => calendar.id !== calendarId));
          setTimeout(() => {
            setDeleted(false);
          }, 5000);
        })
        .catch(error => {
          setLoading(false)
          console.log(error);
        });
    }
  };  

  useEffect(() => {
    axiosClient.get('/calendar')
      .then(response => {
        setData(response.data.data);
        setReloadCalendar(false);
      })
      .catch(error => {
        console.log(error);
      });
  }, [reloadCalendar]);

  const [cancelTokenSource, setCancelTokenSource] = useState(null);

  const handleCheckboxChange = async (event, calendar) => {

    if (cancelTokenSource) {
      cancelTokenSource.cancel("Operation canceled by the user.");
    }

    const newState = { ...checkedBoxes };
    newState[calendar.id] = event.target.checked;
    setCheckedBoxes(newState);
    localStorage.setItem("checkedBoxes", JSON.stringify(newState));
  
    if (event.target.checked) {
      const source = axios.CancelToken.source();
      setCancelTokenSource(source);
  
      try {
        const response = await axiosClient.get(`/event/calendar/${calendar.id}`, {
          cancelToken: source.token,
        });
        const data = response.data.data;
        // Thêm các event vào danh sách
        data.forEach((eventItem) => addEvent(eventItem));
        handleDeleteSuccess();
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          // Xử lý các lỗi khác
        }
      }
    } else {
      removeEventsByCalendarId(calendar.id);
      handleDeleteSuccess();
    }
  };

  useEffect(() => {
    localStorage.setItem("checkedBoxes", JSON.stringify(checkedBoxes));
  }, [checkedBoxes]);
  
  const getCheckboxValue = (calendarId) => {
    if (checkedBoxes[calendarId] !== undefined) {
      return checkedBoxes[calendarId];
    }
    return true;
  };

  return (
    <div>
      {loading && <Loading />}
      {success && (
          <div className="loading-content-overlay">
              <div className="loading-box">
                  <div className="loading-content">
                      <p>Thêm thành công</p>
                      <button
                          onClick={handleClose}
                          title='Close'
                          className='close-notification btn btn-outline-secondary border-0 rounded-5'
                      >
                          <FaTimes />
                      </button>
                  </div>
              </div>
          </div>
      )}
      {deleted && (
          <div className="loading-content-overlay">
              <div className="loading-box">
                  <div className="loading-content">
                      <p>Xóa thành công</p>
                      <button
                          onClick={handleClose}
                          title='Close'
                          className='close-notification btn btn-outline-secondary border-0 rounded-5'
                      >
                          <FaTimes />
                      </button>
                  </div>
              </div>
          </div>
      )}
      {showCreateCalendar && <CreateCalendar onClose={handleClose} onSuccess={handleCreateSuccess}/>}
      {showEditCalendar && (
        <EditCalendar 
          calendar={editingCalendar}
          onClose={handleClose}
        />
      )}
      <div className='calendar'>
        <div className="row align-items-center">
          <div className="col mt-2">
            <h6 className='text-primary'>My calendars</h6>
          </div>
          <div className="col-auto">
            <button onClick={handleCreateCalendarClick} 
              title='Create new calendar'
              className="btn-plus btn btn-outline-secondary rounded-5 border-0">
              <FaPlus />
            </button>
          </div>
        </div>
      </div>
      <div className='calendar-data'>
        {data.map(calendar => (
          <div key={calendar.id} className='row align-items-center custom-height'>
            <div className='col'>
              <Form.Check className='mt-0'>
                <Form.Check.Input 
                  type='checkbox'
                  style={{ backgroundColor: getCheckboxValue(calendar.id) ? calendar.color : 'white', borderColor: calendar.color, fontSize: 15.5 }}
                  defaultChecked={getCheckboxValue(calendar.id)}
                  onChange={(event) => handleCheckboxChange(event, calendar, calendar.id)}
                />
                <Form.Check.Label title={calendar.name}>
                  {calendar.name}
                </Form.Check.Label>
              </Form.Check>
            </div>
            <div className='col-auto'>
              <button 
                onClick={() => handleEditCalendarClick(calendar)}
                title='Edit'
                className="calendar-data-icons-1 btn btn-outline-secondary rounded-5 border-0 ">
                <FaEdit/> 
              </button>
              <button 
                onClick={() => handleDeleteCalendar(calendar.id)}
                title='Delete'
                className="calendar-data-icons-2 btn btn-outline-secondary rounded-5 border-0 ">
                <FaTrash/> 
              </button>
              <button
                onClick={() => handleToggleEventList(calendar.id)}
                className="calendar-data-icons-3 btn btn-outline-secondary rounded-5 border-0"
              >
                {buttonStates[calendar.id] ? <FaAngleUp /> : <FaAngleDown />}
              </button>
            </div>  
            {eventListVisible[calendar.id] && (
              <div className='event-list'>
                {events[calendar.id]?.map(event => (
                  <div key={event.id} className='event-item' onClick={() => handleSelectEvent(event)}>
                    <div className='row event-list-content'>
                      <div className="col event-title">
                        <p>{event.title}</p>
                        </div>
                      <div className="col-auto me-2 event-time"><p>{moment(event.start_time).format('DD-MM')}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}