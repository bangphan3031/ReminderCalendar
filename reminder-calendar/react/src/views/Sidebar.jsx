import React, { useContext, useEffect } from 'react';
import SmallCalendar from './SmallCalendar';
import MyCalendar from './MyCalendar'
import CreateButton from './CreateButton';

export default function Sidebar(props) {

  const {selectedDate} = props;

  const handleDateClick = (date) => {
    props.onDateClick(date);
  };

  return (
    <aside>
      <CreateButton selectedDate={selectedDate}/>
      <div className='small-calendar mt-3'>
        <SmallCalendar onDateClick={handleDateClick}/>
      </div>     
      <div className='my-calendar mt-3'>
        <MyCalendar />
      </div>  
    </aside>
  )
}

