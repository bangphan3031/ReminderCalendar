import React, { useContext, useRef, useState } from 'react';
import { FaTimes, FaCalendarAlt } from 'react-icons/fa';
import axiosClient from '../axios-client';
import Loading from './Loading';
import { AppContext } from '../contexts/AppContext';

export default function CreateCalendar(props) {
    const nameRef = useRef();
    const descriptionRef = useRef();
    const colorRef = useRef();
    const { setLoading, setSuccess, setReloadStorage } = useContext(AppContext);

    const handleCloseClick = () => {
        props.onClose();
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault(); 
        props.onClose();
        setLoading(true);
        const payload = {
            name: nameRef.current.value,
            description: descriptionRef.current.value,
            color: colorRef.current.value
        }
      
        await axiosClient.post('/calendar', payload)
            .then(response => {
                const calendarList = JSON.parse(localStorage.getItem('selectedCalendars')) || [];
                const newCalendar = response.data.data.id;
                calendarList.push(newCalendar);
                localStorage.setItem('selectedCalendars', JSON.stringify(calendarList));
                setReloadStorage(true);
                setSuccess(true);
                setLoading(false);
                props.onSuccess();
                setTimeout(() => {
                    setSuccess(false);
                }, 3000);
            })
            .catch(error => {
                setLoading(false);
                console.error(error);
                alert('Đã có lỗi xảy ra. Vui lòng thử lại sau!');
            });
    }
    
    const handleKeyDown = (ev) => {
        if (ev.keyCode === 13) {
          ev.preventDefault();
          handleSubmit(ev);
        }
    };

    return (
        <div>
        <div className="create-calendar justify-content-center align-items-center w-100">
            <form className="create-calendar rounded-3" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                <header className="px-3 py-1 d-flex align-items-center">
                    <FaCalendarAlt/>
                    <b className='m-1'>Create new calendar</b>
                    <button
                        onClick={handleCloseClick}
                        title='Close'
                        className='close btn btn-outline-secondary border-0 rounded-5'
                    >
                        <FaTimes />
                    </button>
                </header>
                <div className="row p-3">
                    <div className="col-1"></div>
                    <div className="col">
                        <input ref={nameRef} type="text" name='title' placeholder='Name' required
                            className='form-control border-0 border-bottom text-xl font-semibold pb-2 w-100'
                        />
                    </div>
                </div>
                <div className="row p-3 pt-0">
                    <div className="col-1"></div>
                    <div className="col">
                        <textarea ref={descriptionRef} name='description' placeholder='Description'
                            className='form-control border-0 border-bottom text-xl w-100'
                        />
                    </div>
                </div>
                <div className="row p-3">
                    <div className="col-1"></div>
                    <div className="col">
                        <label className="form-label mx-3 fs-6">Color</label>
                        <input ref={colorRef} type="color" name='color' required
                            className='form-control border-0 border-bottom pb-2 w-100'
                        />
                    </div>
                </div>
                <div className="row p-3 d-flex justify-content-end">
                    <div className="col-1"></div>
                    <div className="col-auto">
                        <button className='btn btn-secondary mx-2 fw-bold' type='submit'>Save</button>
                    </div>
                </div>
            </form>
        </div>
        </div>
    );
}

