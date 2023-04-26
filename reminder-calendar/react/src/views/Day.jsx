import React from 'react'
import dayjs from 'dayjs'

export default function Day({ day, rowIdx }) {
  function getCurrentDayClass() {
    return day.format('DD-MM-YY') === dayjs().format('DD-MM-YY') 
    ? 'bg-primary text-light rounded-circle ' 
    : '';
  }
  return (
    <div>
      <div className='d-flex flex-column align-items-center'>
        {rowIdx === 0 && 
          <p className='small mt-1'>{day.format('ddd').toUpperCase()}</p>
        }
        <p className={`small p-1 text-center ${getCurrentDayClass()}`}>{day.format('DD')}</p>
        </div>
    </div>
  )
}
