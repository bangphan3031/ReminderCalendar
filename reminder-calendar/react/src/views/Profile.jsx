import React, { useState } from 'react';
import '../css/Profile.css';
import { useEffect } from "react";
import axiosClient from '../axios-client';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from "../contexts/ContextProvider";

export default function Profile() {
  const {token} = useStateContext()
    if (token) {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [image, setImage] = useState('');

    useEffect(() => {
        axiosClient.get('/profile')
        .then(response => {
            setName(response.data.name);
            setEmail(response.data.email);
            setPhone(response.data.phone);
            setImage(response.data.image);
        })
        .catch(error => {
            console.log(error);
        });
    }, []);
    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const payload = {
            name: name,
            email: email,
            phone: phone,
            image: image
        };
        // const formData = new FormData();
        // formData.append('name', name);
        // formData.append('email', email);
        // formData.append('phone', phone);
        // formData.append('image', image);
        // formData.append('Content-Type', 'application/json');
        // Handle saving data to backend or local storage
        axiosClient.put('/profile', payload)
            .then(response => {
                alert('Cập nhật thành công.');
                navigate('/');
                window.location.reload();
            })
        .catch(error => {
            console.log(error);
        });
    }
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

  return (
    <div className="profile-container">
      <form onSubmit={handleSubmit}>
        <div className="profile-picture">
            <img src={"http://localhost:8000/uploads/1682192263.jpg"} alt="Profile Picture" />
          <label>
            Change profile picture:
            <input type="file" onChange={handleImageChange}/>
          </label>
        </div>
        <div className="profile-info">
          <div className="left">
            <label>
              Name:
              <input type="text" value={name} onChange={handleNameChange} placeholder="Name"/>
            </label>
            <label>
              Email:
              <input type="email" value={email} disabled placeholder="***" />
            </label>
            <label>
              Phone:
              <input type="tel" value={phone} disabled placeholder="***" />
            </label>
          </div>
          <div className="right">
            <button type="submit">Save</button>
          </div>
        </div>
      </form>
    </div>
  );
    } else {
      <Outlet />
    }
}
