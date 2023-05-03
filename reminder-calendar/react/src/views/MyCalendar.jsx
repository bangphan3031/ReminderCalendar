import React, { useState, useEffect } from 'react';
import axiosClient from '../axios-client';
import { Form } from 'react-bootstrap';
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
import CreateCalendar from './CreateCalendar';
import EditCalendar from './EditCalendar';

export default function MyCalendar(props) {
  const [data, setData] = useState([]);
  const [showCreateCalendar, setShowCreateCalendar] = useState(false);
  const [showEditCalendar, setShowEditCalendar] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState(null);

  const [checkedBoxes, setCheckedBoxes] = useState(
    JSON.parse(localStorage.getItem("checkedBoxes")) || {}
  );

  const handleCreateCalendarClick = () => {
    setShowCreateCalendar(true);
  };

  const handleEditCalendarClick = (calendarId) => {
    setEditingCalendar(calendarId);
    setShowEditCalendar(true);
  };

  const handleClose = () => {
    setShowCreateCalendar(false);
    setShowEditCalendar(false);
  };

  const handleDeleteCalendar = (calendarId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch này không?')) {
      axiosClient.delete(`/calendar/${calendarId}`)
        .then(response => {
          setData(data.filter(calendar => calendar.id !== calendarId));
          alert('Lịch đã được xóa')
        })
        .catch(error => {
          console.log(error);
        });
    }
  };  

  useEffect(() => {
    axiosClient.get('/calendar')
      .then(response => {
        setData(response.data.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleCheckboxChange = (event, calendar) => {
    const newState = { ...checkedBoxes };
    newState[calendar.id] = event.target.checked;
    setCheckedBoxes(newState);
    localStorage.setItem("checkedBoxes", JSON.stringify(newState));
  };

  const getCheckboxValue = (calendar) => {
    if (checkedBoxes[calendar.id] !== undefined) {
      return checkedBoxes[calendar.id];
    }
    return true;
  };

  return (
    <div>
      {showCreateCalendar && <CreateCalendar onClose={handleClose} />}
      {showEditCalendar && (
        <EditCalendar 
          id={editingCalendar}
          onClose={handleClose}
        />
      )}
      <div className='calendar'>
        <div className="row align-items-center">
          <div className="col mt-2">
            <h6>My calendars</h6>
          </div>
          <div className="col-auto">
            <button onClick={handleCreateCalendarClick} 
              className="btn-plus btn btn-outline-secondary rounded-5 border-0">
              <FaPlus />
            </button>
          </div>
        </div>
      </div>
      <div className='calendar-data'>
        {data.map(calendar => (
          <div key={calendar.id} className='row align-items-center'>
            <div className='col'>
              <Form.Check className='mt-2'>
                <Form.Check.Input 
                  type='checkbox'
                  style={{backgroundColor: checkedBoxes[calendar.id] ? calendar.color : 'white', borderColor: calendar.color, fontSize: 15.5}}
                  defaultChecked={getCheckboxValue(calendar)}
                  onChange={(event) => handleCheckboxChange(event, calendar)}
                ></Form.Check.Input>
                <Form.Check.Label title={calendar.name} className='calendar-lable'>
                  {calendar.name}
                </Form.Check.Label>
              </Form.Check>
            </div>
            <div className='col-auto'>
              <button 
                onClick={() => handleEditCalendarClick(calendar.id)}
                className="btn btn-outline-secondary rounded-5 border-0 ">
                <FaEdit size={15}/> 
              </button>
              <button 
                onClick={() => handleDeleteCalendar(calendar.id)}
                className="btn btn-outline-secondary rounded-5 border-0 ">
                <FaTrash size={15}/> 
              </button>
            </div>  
          </div>
        ))}
      </div>
   </div>
  )
}