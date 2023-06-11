import React from 'react'
import logo from '../assets/TamNhuLogo.jpg';
import { useStateContext } from "../contexts/ContextProvider";
import { FaArrowLeft } from 'react-icons/fa';
import { Navigate, useNavigate } from 'react-router-dom'

export default function SubLayoutHeader() {
    const {user, token, setUser, setToken} = useStateContext()
    const navigate = useNavigate();

    if(!token) {
        return <Navigate to="/login" />
    }

    const handleBackClick = () => {
        navigate('/')
    }

    return (
        <div>
            <header className="px-1 py-1 d-flex align-items-center border-bottom">
                <button className='btn btn-outline-secondary rounded-5 border-0 mt-1 ms-3 mb-1'
                    onClick={handleBackClick}>
                    <FaArrowLeft className='profile-icon'/>
                </button>
                <img src={logo} alt="calendar" className="logo" />
                <h4 className="mt-1 text-primary"> Thủy sản Tâm Như </h4>
            </header>
        </div>
    )
}
