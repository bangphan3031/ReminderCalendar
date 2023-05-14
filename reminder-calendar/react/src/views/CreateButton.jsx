import React, { useState } from 'react';
import plus from '../assets/plus-icon.png';
import CreateEvent from './CreateEvent';

export default function CreateButton(props) {
    const {selectedDate} = props;
    const [showCreateEvent, setShowCreateEvent] = useState(false);

    const handleCreateEventClick = () => {
        setShowCreateEvent(true);
    };

    const handleCloseCreateEvent = () => {
        setShowCreateEvent(false);
    };

    return (
        <div>
            {showCreateEvent && <CreateEvent onClose={handleCloseCreateEvent} selectedDate={selectedDate}/>}
            <button 
                onClick={handleCreateEventClick} 
                className='create btn btn-outline-secondary border mt-3 px-2 py-2 rounded-pill d-flex align-items-center'
            > 
                <img src={plus} alt="create_event" className='plus' />
                <span className='px-3 fw-bold'> Create </span>
            </button>   
        </div>
    );
}
