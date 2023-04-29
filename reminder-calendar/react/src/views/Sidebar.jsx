import React, { useContext, useEffect } from 'react';
import SmallCalendar from './SmallCalendar';
import MyCalendar from './MyCalendar'
import CreateButton from './CreateButton';

export default function Sidebar() {

  return (
    <aside>
      <CreateButton />
      <div className='small-calendar mt-3'>
        <SmallCalendar />
      </div>     
      <div className='my-calendar mt-3'>
        <MyCalendar />
      </div>  
    </aside>
  )
}

