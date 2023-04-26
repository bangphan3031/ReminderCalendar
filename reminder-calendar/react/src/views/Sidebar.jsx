import React from 'react'
import plus from '../assets/plus.png'

export default function Sidebar() {
  return (
    <aside>
      <button className='create btn btn-outline-secondary border mt-3 px-2 py-2 rounded-pill d-flex align-items-center'>
        <img src={plus} alt="create_event" className='plus' />
        <span className='px-3 fw-bold'> Create </span>
      </button>
    </aside>
  )
}
