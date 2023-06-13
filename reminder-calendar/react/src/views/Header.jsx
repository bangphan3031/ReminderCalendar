import React, { useState } from 'react';
import logo from '../assets/TamNhuLogo.jpg';
import { Navigate, Link} from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect } from "react";
import axiosClient from "../axios-client";
import { Dropdown} from 'react-bootstrap'
import { FaUser, FaSignOutAlt, FaTh, FaTrashAlt, FaCalendarCheck, FaEdit, FaCalendarTimes, FaSearch} from 'react-icons/fa';
import ChangePassword from './ChangePassword';

export default function Header() {
    const {user, token, setUser, setToken} = useStateContext()
    const [showCreateEvent, setShowCreateEvent] = useState(false);

    const handleCreateEventClick = () => {
        setShowCreateEvent(true);
    };

    const handleCloseCreateEvent = () => {
        setShowCreateEvent(false);
    };

    const onLogout = ev => {
        ev.preventDefault()
    
        axiosClient.post('/logout')
          .then(() => {
            setUser({})
            setToken(null)
            localStorage.removeItem("selectedValue")
            localStorage.removeItem("selectedCalendars")
            localStorage.removeItem("checkedBoxes")
        })
        .catch(error => {
            alert('Đã có lỗi xảy ra! Vui lòng thử lại sau') 
            console.log(error)
        });
    }

    useEffect(() => {
        axiosClient.get('/profile')
        .then(({data}) => {
            setUser(data)
        })
    }, [])

    if(!token) {
        return <Navigate to="/login" />
    }
    
    return (
        <div>
            {showCreateEvent && <ChangePassword onClose={handleCloseCreateEvent}/>}
            <header className="px-1 py-1 d-flex align-items-center border-bottom">
                <img src={logo} alt="calendar" className="logo" />
                <h4 className="mt-1 text-primary"> Thủy sản Tâm Như </h4>
                <div className="dropdown-wrapper">
                    <Dropdown className="dropdown">
                        <Dropdown.Toggle variant="basic" id="dropdown-basic" className='rounded-5'>
                            <FaTh style={{ fontSize: '20px' }} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu">
                            <Dropdown.Item as={Link} to="/search">
                                <FaSearch/> Search
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="/completed-event">
                                <FaCalendarCheck/> Completed Events
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="/incomplete-event">
                                <FaCalendarTimes/> Incomplete Events
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="/trash">
                                <FaTrashAlt/> Trash
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className="my-dropdown">
                        <Dropdown.Toggle variant="basic" id="dropdown-basic">
                            {user?.image && <img className='img rounded-5' title={user?.name} src={"http://localhost:8000/uploads/"+ user.image}/>}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="my-dropdown-menu">
                            <Dropdown.Item as={Link} to="account/profile">
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
