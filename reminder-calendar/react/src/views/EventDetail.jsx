import moment from 'moment';
import React, { useContext, useEffect } from 'react'
import { FaCalendarAlt, FaClock, FaEdit, FaTimes, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext'

export default function EventDetail(props) {
  const { handleCloseEventDetails, selectedEvent } = useContext(AppContext);
  const { handleDeleteEvent} = props;

  const handleCloseEventDetail = () => {
    handleCloseEventDetails()
  }

  let formatTime = '';
  if (selectedEvent) {
      const allday = selectedEvent.is_all_day;
      const startTime = moment(selectedEvent.start_time).format('DD-MM-YYYY');
      const endTime = moment(selectedEvent.end_time).format('DD-MM-YYYY');
      formatTime = allday && startTime == endTime 
      ? moment(selectedEvent.start_time).format('DD-MM-YYYY')
      : allday && startTime != endTime
          ? moment(selectedEvent.start_time).format('DD-MM-YYYY') + " - " + moment(selectedEvent.end_time).format('DD-MM-YYYY')
          : !allday && startTime == endTime
          ? startTime + ", " + moment(selectedEvent.start_time).format('h:mm a') + " - " + moment(selectedEvent.end_time).format('h:mm a')
          : moment(selectedEvent.start_time).format('DD-MM-YYYY, h:mm a') + " - " + moment(selectedEvent.end_time).format('DD-MM-YYYY, h:mm a');
  }

  return (
    <div>
      <div className="event-detail justify-content-center align-items-center w-100">
        <div className="event-detail rounded-3">
          <header className="px-3 py-1 d-flex align-items-center">
            <Link to={`/edit-event?id=${selectedEvent.id}`}>
              <button 
                title='Edit' 
                className='edit btn btn-outline-secondary border-0 rounded-5'>
                <FaEdit />
              </button>
            </Link>
            <button 
              title='Delete' 
              className='delete btn btn-outline-secondary border-0 rounded-5'
              onClick={() => handleDeleteEvent(selectedEvent.id)}>
              <FaTrash />
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
              <div className='calendar-name'>{selectedEvent.name}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
