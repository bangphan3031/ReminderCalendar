import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect } from "react";
import axiosClient from "../axios-client";
import { Dropdown, Image } from 'react-bootstrap';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function DefautltLayout() {
    const {user, token, setUser, setToken, notification} = useStateContext()

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
        axiosClient.get('/profile')
        .then(({data}) => {
            setUser(data)
        })
    }, [])

    return (
        <div id="defaultLayout">
            <aside>
                <Link to="/dashboard" >Dashboard</Link>
            </aside>
            <div className="content">
                <header>
                    <div>
                        Header
                    </div>
                    <Dropdown className="my-dropdown">
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            {user?.image && <Image src={"http://localhost:8000/uploads/"+ user.image} roundedCircle width={50} height={50} />}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="my-dropdown-menu">
                            <Dropdown.Item href="/account/profile"><FaUser /> Profile</Dropdown.Item>
                            <Dropdown.Item onClick={onLogout}><FaSignOutAlt /> Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </header>
                <main>
                    <Outlet />
                </main>
                {notification &&
                    <div className="notification">
                        {notification}
                    </div>
                }
            </div>
        </div>
    )
}