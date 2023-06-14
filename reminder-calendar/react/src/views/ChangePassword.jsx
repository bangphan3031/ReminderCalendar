import React, { useContext, useState } from 'react';
import { FaTimes} from 'react-icons/fa';
import axiosClient from '../axios-client';

import { AppContext } from '../contexts/AppContext';

export default function ChangePassword(props) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(''); 
    const { setUpdated } = useContext(AppContext);

    const handleCloseClick = () => {
        props.onClose();
    };
    
    const handleSubmit = (ev) => {
        ev.preventDefault();
    
        axiosClient
            .post('/change-password', { current_password: currentPassword, new_password: newPassword, confirm_password: confirmPassword })
            .then((response) => {
                setUpdated(true)
                props.onClose();
                setTimeout(() => {
                    setUpdated(false);
                }, 3000);
            })
            .catch((error) => {
                console.error(error.response.data);
                setError(error.response.data.message)
            });
    };
    
    return (
        <div className="create-event justify-content-center align-items-center w-100">
            <form className="create-event rounded-3" onSubmit={handleSubmit}>
                <header className="px-3 py-1 d-flex align-items-center">
                    <b className='m-1'>Change Password</b>
                    <button
                        onClick={handleCloseClick}
                        title='Close'
                        className='close btn btn-outline-secondary border-0 rounded-5'
                    >
                        <FaTimes />
                    </button>
                </header>
                <div className='p-3'>
                    {error && <p className='text-danger'>{error}</p>}
                </div>
                <div className="row p-3 pt-0">
                    <div className="col">
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(event) => setCurrentPassword(event.target.value)}
                            className='form-control border-0 border-bottom text-xl w-100'
                            required
                            autoComplete="current-password" 
                        />
                    </div>
                </div>
                <div className="row p-3 pt-0">
                    <div className="col">
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            className='form-control border-0 border-bottom text-xl w-100'
                            required
                            autoComplete="new-password" 
                        />
                    </div>
                </div>
                <div className="row p-3 pt-0">
                    <div className="col">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            className='form-control border-0 border-bottom text-xl w-100'
                            required
                            autoComplete="new-password" 
                        />
                    </div>
                </div>
                <div className="row p-3 d-flex justify-content-end">
                    <div className="col-auto">
                        <button className='btn btn-secondary mx-2 fw-bold' type='submit'>Save</button>
                    </div>
                </div>
            </form>
        </div>
    );    
}
