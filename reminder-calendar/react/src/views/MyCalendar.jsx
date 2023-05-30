import React, { useState, useEffect, useContext } from 'react';
import axiosClient from '../axios-client';
import { Form} from 'react-bootstrap';
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
  const [isLoaded, setIsLoaded] = useState(false);
  const { 
    loading, 
    setLoading, 
    success, 
    deleted, setDeleted, 
    updated, 
    handleShowEventDetails, 
    setSelectedEvent,
    setReloadStorage,
    updateSelectedCalendars,
    reloadCalendar, setReloadCalendar,
    reloadEvent,
    resetReloadCalendar,
    handleDeleteSuccess,
  } = useContext(AppContext);
  
  const [selectedCalendars, setSelectedCalendars] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventListVisible, setEventListVisible] = useState({});
  const [buttonStates, setButtonStates] = useState(() => {
    const initialButtonStates = {};
    data.forEach(calendar => {
      initialButtonStates[calendar.id] = false;
    });
    return initialButtonStates;
  });

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
    let isReload = false;

    const fetchEvents = async (calendarId) => {
      try {
        const response = await axiosClient.get(`/event/calendar/${calendarId}`);
        console.log('Đang chạy')
        setEvents(prevEvents => ({
          ...prevEvents,
          [calendarId]: response.data.data
        }));
      } catch (error) {
        console.log(`Error fetching events for calendar ${calendarId}:`, error);
      }
    };

    if (reloadEvent) {
      isReload = true;
    }
  
    data.forEach(calendar => {
      if (isReload) {
        fetchEvents(calendar.id);
      }
    });
    
  }, [data, reloadEvent]);

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
  };

  const handleDeleteCalendar = (calendarId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch này không?')) {
      setLoading(true);
      axiosClient.delete(`/calendar/${calendarId}`)
        .then(response => {
          handleDeleteSuccess()
          setDeleted(true)
          setLoading(false)
          setData(data.filter(calendar => calendar.id !== calendarId));
          setTimeout(() => {
            setDeleted(false);
          }, 3000);
        })
        .catch(error => {
          setLoading(false)
          alert('Đã có lỗi xảy ra! Vui long thử lại sau.')
          console.log(error);
        });
    }
  };  

  useEffect(() => {
    axiosClient.get('/calendar')
      .then(response => {
        setData(response.data.data);
        const calendarId = response.data.data.map(calendar => calendar.id);
        resetReloadCalendar()
      })
      .catch(error => {
        console.log(error);
      });
  }, [reloadCalendar]);

  useEffect(() => {
    // Kiểm tra nếu có giá trị trong localStorage
    const storedSelectedCalendars = localStorage.getItem('selectedCalendars');
    if (storedSelectedCalendars && storedSelectedCalendars.length > 0) {
      setSelectedCalendars(JSON.parse(storedSelectedCalendars));
      setIsLoaded(true);
    } else {
      axiosClient.get('/calendar')
        .then(response => {
          const calendarIds = response.data.data.map(calendar => calendar.id);
          setSelectedCalendars(calendarIds);
          setIsLoaded(true);
          updateSelectedCalendars(calendarIds);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('selectedCalendars', JSON.stringify(selectedCalendars));
    }
  }, [selectedCalendars, isLoaded]);

  const handleCheckboxChange = async (event, calendarId) => {
    const newState = { ...checkedBoxes };
    newState[calendarId] = event.target.checked;
    setCheckedBoxes(newState);
    localStorage.setItem("checkedBoxes", JSON.stringify(newState));
  
    if (event.target.checked) {
      setSelectedCalendars([...selectedCalendars, calendarId]);
      setReloadStorage(true);
    } else {
      setSelectedCalendars(selectedCalendars.filter(id => id !== calendarId));
      setReloadStorage(true);
    }
  };

  useEffect(() => {
    console.log(selectedCalendars)
  }, [selectedCalendars]);

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
      {success || deleted || updated ? (
        <div className="loading-content-overlay">
          <div className="loading-box">
            <div className="loading-content">
              {success ? (
                <p>Thêm thành công.</p>
              ) : deleted ? (
                <p>Xóa thành công.</p>
              ) : updated ? (
                <p>Sửa thành công.</p>
              ) : null}
              <button
                onClick={handleClose}
                title="Close"
                className="close-notification btn btn-outline-secondary border-0 rounded-5"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      ) : null}
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
        {data.map((calendar, index) => (
          <div key={calendar.id} className='row align-items-center custom-height'>
            <div className='col'>
              <Form.Check className='mt-0'>
                <Form.Check.Input 
                  type='checkbox'
                  style={{ backgroundColor: getCheckboxValue(calendar.id) ? calendar.color : 'white', borderColor: calendar.color, fontSize: 15.5 }}
                  defaultChecked={getCheckboxValue(calendar.id)}
                  onChange={(event) => handleCheckboxChange(event, calendar.id)}
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
              {index > 0 && ( // Ẩn button Delete nếu index là 0
                <button 
                  onClick={() => handleDeleteCalendar(calendar.id)}
                  title='Delete'
                  className="calendar-data-icons-2 btn btn-outline-secondary rounded-5 border-0 ">
                  <FaTrash/> 
                </button>
              )}
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