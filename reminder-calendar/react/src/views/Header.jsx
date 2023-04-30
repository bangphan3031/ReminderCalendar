import React, {useState} from 'react';
import logo from '../assets/logo-1.png';
import { Navigate,} from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect } from "react";
import axiosClient from "../axios-client";
import { Dropdown} from 'react-bootstrap'
import { FaUser, FaSignOutAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import moment from 'moment';

export default function Header() {
    const [selectedValue, setSelectedValue] = useState(localStorage.getItem("selectedValue") || "Month");
    const {user, token, setUser, setToken} = useStateContext()
    const [currentMonth, setCurrentMonth] = useState(moment());

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
    localStorage.setItem("selectedValue", selectedValue);
    }, [selectedValue]);

    useEffect(() => {
        axiosClient.get('/profile')
        .then(({data}) => {
            setUser(data)
        })
    }, [])

    // Bấm vào nút "Today"
    const handleTodayClick = () => {
        setCurrentMonth(moment());
    }
    
    // Bấm vào nút "ChevronLeft"
    const handlePrevMonthClick = () => {
        setCurrentMonth(currentMonth.clone().subtract(1, "month"));
    }
    
    // Bấm vào nút "ChevronRight"
    const handleNextMonthClick = () => {
        setCurrentMonth(currentMonth.clone().add(1, "month"));
    }

    if(!token) {
        return <Navigate to="/login" />
    }

    return (
        <header className="px-1 py-1 d-flex align-items-center border-bottom">
            <img src={logo} alt="calendar" className="logo" />
            <h4 className="mt-1 text-primary"> Calendar </h4>
            <button className="today btn btn-outline-secondary" onClick={handleTodayClick}>
                Today
            </button>
            <button className="chevronleft btn btn-outline-secondary rounded-5 border-0" onClick={handlePrevMonthClick}>
                <FaChevronLeft /> 
            </button>
            <button className="btn btn-outline-secondary rounded-5 border-0" onClick={handleNextMonthClick}>
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
