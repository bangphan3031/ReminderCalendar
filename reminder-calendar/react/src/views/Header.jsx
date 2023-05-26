import React, {useState} from 'react';
import logo from '../assets/TamNhuLogo.jpg';
import { Navigate,} from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect } from "react";
import axiosClient from "../axios-client";
import { Dropdown} from 'react-bootstrap'
import { FaUser, FaSignOutAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import moment from 'moment';

export default function Header() {
    const {user, token, setUser, setToken} = useStateContext()

    const onLogout = ev => {
        ev.preventDefault()
    
        axiosClient.post('/logout')
          .then(() => {
            setUser({})
            setToken(null)
            localStorage.removeItem("selectedValue")
        })
        .catch(error => console.log(error));
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
        <header className="px-1 py-1 d-flex align-items-center border-bottom">
            <img src={logo} alt="calendar" className="logo" />
            <h4 className="mt-1 text-primary"> Thủy sản Tâm Như </h4>
            <Dropdown className="my-dropdown">
                <Dropdown.Toggle variant="basic" id="dropdown-basic">
                    {user?.image && <img className='img rounded-circle' title={user?.name} src={"http://localhost:8000/uploads/"+ user.image}/>}
                </Dropdown.Toggle>
                <Dropdown.Menu className="my-dropdown-menu">
                    <Dropdown.Item href="/account/profile"><FaUser /> Profile</Dropdown.Item>
                    <Dropdown.Item onClick={onLogout}><FaSignOutAlt /> Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </header>
    )
}
