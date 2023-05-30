import React, { useState, useEffect, useContext } from 'react';
import axiosClient from '../axios-client';
import moment from 'moment';
import EventDetail from './EventDetail';
import { AppContext } from '../contexts/AppContext'

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
    const { 
        reloadEvent, 
        showEventDetails, 
        handleShowEventDetails, 
        handleCloseEventDetails, 
        handleDeleteSuccess,
        selectedEvent, 
        setSelectedEvent
    } = useContext(AppContext);
    const [initialLoad, setInitialLoad] = useState(true);
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
        let isReloadEvent = false;
        const fetchEvents = async () => {
            try {
                const response = await axiosClient.get('/event/upcoming');
                setData(response.data.data);
                setMyEventsList(data);
            } catch (error) {
                console.log(error);
            }
        };
        if (initialLoad) {
            fetchEvents();
            setInitialLoad(false);
        } else {
            if (reloadEvent) {
                isReloadEvent = true;
            }
            if (isReloadEvent) {
                fetchEvents();
            }
        }
    }, [initialLoad, reloadEvent]);

    const handleSelectEvent = event => {
        setSelectedEvent(event);
        handleShowEventDetails();
    };

    useEffect(()=>{
        console.log(selectedEvent)
    },[])

    const handleDeleteEvent = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa công việc này không?')) {
          axiosClient.delete(`/event/${id}`)
            .then(response => {
                alert('Xóa thành công')
                handleDeleteSuccess();
                handleCloseEventDetails();
            })
            .catch(error => {
              console.log(error);
            });
        }
    };

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
                        <span className='ms-1 upcoming-event-title'>{event.title}</span>
                    </div> 
                    <div className='col-5'>
                        <span className='ms-2'>{getTimeRemaining(event.start_time)}</span>
                    </div> 
                </div>
                ))}
            </div>
            {selectedEvent && showEventDetails && (
            <EventDetail 
                selectedEvent={selectedEvent} 
                handleDeleteEvent={handleDeleteEvent} 
            />
             )}
        </div>
    )
}