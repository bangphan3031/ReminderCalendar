import React, {useState} from 'react';
import logo from '../assets/logo-1.png';
import { Navigate,} from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect } from "react";
import axiosClient from "../axios-client";
import '../index.css';
import { Dropdown} from 'react-bootstrap'
import { FaUser, FaSignOutAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Header() {
    const [selectedValue, setSelectedValue] = useState(localStorage.getItem("selectedValue") || "Month");
    const {user, token, setUser, setToken} = useStateContext()
    if(!token) {
        return <Navigate to="/login" />
    }

    const onLogout = ev => {
        ev.preventDefault()
    
        axiosClient.post('/logout')
          .then(() => {
            setUser({})
            setToken(null)
        })
    }
    useEffect(() => {
    localStorage.setItem("selectedValue", selectedValue);
    }, [selectedValue]);

    useEffect(() => {
        axiosClient.get('/profile')
        .then(({data}) => {
            setUser(data)
        })
    }, [])
    return (
        <header className="px-1 py-1 d-flex align-items-center border">
            <img src={logo} alt="calendar" class="logo" />
            <h4 className="mt-1 text-primary"> Calendar </h4>
            <button className="today btn btn-outline-secondary">
                Today
            </button>
            <button className="chevronleft btn btn-outline-secondary rounded-5 border-0">
                <FaChevronLeft /> 
            </button>
            <button className="btn btn-outline-secondary rounded-5 border-0">
                <FaChevronRight /> 
            </button>
            <Dropdown className="dropdown-time">
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-secondary">
                    {selectedValue}
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu">
                    <Dropdown.Item href="" onClick={() => setSelectedValue("Month")}> Month</Dropdown.Item>
                    <Dropdown.Item href="" onClick={() => setSelectedValue("Week")}> Week</Dropdown.Item>
                    <Dropdown.Item href="" onClick={() => setSelectedValue("Day")}> Day </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
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
