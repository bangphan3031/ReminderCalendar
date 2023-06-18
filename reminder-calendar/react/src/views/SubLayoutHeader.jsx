import React, { useEffect, useState } from 'react'
import { useStateContext } from "../contexts/ContextProvider";
import { FaArrowLeft, FaEdit, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Dropdown } from 'react-bootstrap';
import axiosClient from '../axios-client';
import ChangePassword from './ChangePassword';

export default function SubLayoutHeader() {
    const {user, token, setUser, setToken} = useStateContext()
    const [showCreateEvent, setShowCreateEvent] = useState(false);
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/')
    }

    const handleCreateEventClick = () => {
        setShowCreateEvent(true);
    };

    const handleCloseCreateEvent = () => {
        setShowCreateEvent(false);
    };

    useEffect(() => {
        axiosClient.get('/profile')
        .then(({data}) => {
            setUser(data)
        })
    }, [])

    const onLogout = ev => {
        ev.preventDefault()
    
        axiosClient.post('/logout')
          .then(() => {
            setUser({})
            setToken(null)
            localStorage.removeItem("selectedValue")
            localStorage.removeItem("selectedCalendars")
            localStorage.removeItem("checkedBoxes")
            localStorage.removeItem("searchCalendarId")
            localStorage.removeItem("searchKeyword")
            localStorage.removeItem("searchStartTime")
            localStorage.removeItem("searchEndTime")
            localStorage.removeItem("searchStatus")
        })
        .catch(error => {
            alert('Đã có lỗi xảy ra! Vui lòng thử lại sau') 
            console.log(error)
        });
    }

    if(!token) {
        return <Navigate to="/login" />
    }

    return (
        <div>
            {showCreateEvent && <ChangePassword onClose={handleCloseCreateEvent}/>}
            <header className="px-1 py-1 d-flex align-items-center border-bottom">
                <button className='btn btn-outline-secondary rounded-5 border-0 mt-1 ms-3 mb-1'
                    onClick={handleBackClick}>
                    <FaArrowLeft className='profile-icon'/>
                </button>
                <div className="dropdown-wrapper" style={{marginRight: "12px"}}>
                    <Dropdown className="my-dropdown">
                        <Dropdown.Toggle variant="basic" id="dropdown-basic">
                            {user?.image && <img className='img rounded-5' title={user?.name} src={"http://localhost:8000/uploads/"+ user.image}/>}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="my-dropdown-menu">
                            <Dropdown.Item as={Link} to='http://localhost:3000/account/profile'>
                                <FaUser /> Profile
                            </Dropdown.Item>
                            <Dropdown.Item onClick={handleCreateEventClick}>
                                <FaEdit /> Change password
                            </Dropdown.Item>
                            <Dropdown.Item onClick={onLogout}>
                                <FaSignOutAlt /> Logout
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </header>
        </div>
    )
}
