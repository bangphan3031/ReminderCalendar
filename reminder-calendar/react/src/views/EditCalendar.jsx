import React, { useEffect, useRef, useState } from 'react';
import { FaTimes, FaCalendarAlt } from 'react-icons/fa';
import axiosClient from '../axios-client';

export default function EditCalendar(props) {

    const {id} = props;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('');

    const handleCloseClick = () => {
        props.onClose();
    };

    useEffect(() => {
        axiosClient.get(`/calendar/${id}`)
          .then(response => {
            setName(response.data.data.name);
            setDescription(response.data.data.description);
            setColor(response.data.data.color);
          })
          .catch(error => {
            console.log(error);
          });
    }, [id]);

    const handleSubmit = (event) => {
        event.preventDefault()
        axiosClient.put(`/calendar/${id}`, {
          name: name,
          description: description,
          color: color,
        })
        .then(response => {
            alert('Lịch đã được cập nhật');
            window.location.reload()
        })
        .catch(error => {
            console.log(error);
        });
    };

    const handleKeyDown = (ev) => {
        if (ev.keyCode === 13) {
          ev.preventDefault();
          handleSubmit(ev);
        }
    };

    return (
        <div className="create-calendar justify-content-center align-items-center w-100">
            <form className="create-calendar rounded-3" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                <header className="px-3 py-1 d-flex align-items-center">
                    <FaCalendarAlt/>
                    <b className='m-1'>Edit calendar</b>
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
                        <input type="text" name='title' value={name} placeholder='Name' required 
                            onChange={(event) => setName(event.target.value)}
                            className='form-control border-0 border-bottom text-xl font-semibold pb-2 w-100'
                        />
                    </div>
                </div>
                <div className="row p-3 pt-0">
                    <div className="col-1"></div>
                    <div className="col">
                    <textarea name='description' value={description || ''} placeholder='Description'
                        onChange={(event) => setDescription(event.target.value)}
                        className='form-control border-0 border-bottom text-xl w-100'
                    />
                    </div>
                </div>
                <div className="row p-3">
                    <div className="col-1"></div>
                    <div className="col">
                        <label className="form-label mx-3 fs-6">Color</label>
                        <input type="color" value={color} name='color' required
                            onChange={(event) => setColor(event.target.value)}
                            className='form-control border-0 border-bottom pb-2 w-100'
                        />
                    </div>
                </div>
                <div className="row p-3 d-flex justify-content-end">
                    <div className="col-1"></div>
                    <div className="col-auto">
                        <button className='btn btn-secondary mx-2 fw-bold' type='submit'>Lưu</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

