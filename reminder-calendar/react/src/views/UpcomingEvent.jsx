import React, { useState, useEffect } from 'react';
import axiosClient from '../axios-client';
import moment from 'moment';
import EventDetail from './EventDetail';

function getTimeRemaining(start_time) {
    const now = moment();
    const start = moment(start_time);
    const duration = moment.duration(start.diff(now));
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes(); 
    let remainingTime = '';
  
    if (days > 0) {
      remainingTime += `${days}d`;
    }
    if (hours > 0) {
      remainingTime += `${hours}h`;
    }
    if (minutes > 0) {
      remainingTime += `${minutes}m`;
    }
  
    return remainingTime;
}

export default function UpcomingEvent(props) {
    const [showEventDetail , setShowEventDetail] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [remainingTimes, setRemainingTimes] = useState({});
    const [myEventsList, setMyEventsList] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const times = {};
        
            data.forEach((event) => {
                times[event.id] = getTimeRemaining(event.start_time);
            });
    
          setRemainingTimes(times);
        }, 1000);
    
        return () => clearInterval(intervalId);
    }, [data]);

    useEffect(() => {
        axiosClient.get('/event/upcoming')
        .then(response => {
            setData(response.data.data);
            setMyEventsList(data);
        })
        .catch(error => {
            console.log(error);
        });
    }, []);

    const handleSelectEvent = event => {
        setSelectedEvent(event);
        setShowEventDetail(true);
    };

    const handleDeleteEvent = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa công việc này không?')) {
          axiosClient.delete(`/event/${id}`)
            .then(response => {
                setMyEventsList(myEventsList.filter(event => event.id !== id));
                setData(data.filter(event => event.id !== id));
                setShowEventDetail(false);
                alert('Xóa thành công')
            })
            .catch(error => {
              console.log(error);
            });
        }
    };

    const handleCloseEventDetail  = () => {
        setShowEventDetail(false);
        setSelectedEvent(null)
    };

    useEffect(() => {
        console.log(selectedEvent);
    }, [selectedEvent]);

    return (
        <div>
            <div className='event'>
                <div className="row align-items-center">
                    <div className="col mt-0">
                        <h6 className='text-primary'>Upcoming event</h6>
                    </div>
                </div>
            </div>
            <div className='event-data'>
                {data.map(event => (
                <div key={event.id} className='row align-items-center on-event-data' 
                    onClick={() => handleSelectEvent(event)}>
                    <div className='col-7 d-flex'>
                        <div className='event-color' style={{ backgroundColor: event.color}}></div>
                        <span className='ms-1'>{event.title}</span>
                    </div> 
                    <div className='col-5'>
                        <span className='ms-2'>{getTimeRemaining(event.start_time)}</span>
                    </div> 
                </div>
                ))}
            </div>
            {selectedEvent && showEventDetail && (
            <EventDetail 
                selectedEvent={selectedEvent} 
                handleCloseEventDetail={handleCloseEventDetail} 
                handleDeleteEvent={handleDeleteEvent} 
            />
             )}
        </div>
    )
}