import React, { useState } from 'react';
import { useEffect } from "react";
import axiosClient from '../axios-client';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBackward } from "react-icons/fa";

export default function Profile() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
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

  const formattedPhone = phone.slice(0,3) + '****' + phone.slice(-3);
  const formattedEmail = email.slice(0,5) + '*********' + email.slice(-10);

  const handleNameChange = (event) => {
      setName(event.target.value);
  }

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleHomeClick = () => {
    navigate('/')
  }

  const handleBackClick = () => {
    navigate(-1)
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    const payload = {
      name: name,
      email: email,
      phone: phone,
      image: image
    }
  
    try {
      const editResponse = await axiosClient.put('/profile', payload);
  
      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);
        const uploadResponse = await axiosClient.post('/profile/upload', formData);
        console.log(editResponse, uploadResponse);
      }
      alert('Cập nhật thông tin thành công');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Cập nhật thất bại!');
    }
  }

  return (
    <div className="profile-page">
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="row border rounded-4 p-3 bg-white shadow box-area">
          <div className="col-7 right-box">
            <div className="row align-items-center" style={{height: 400}}>
              <div className="header-text mb-3">
                <h2>My profile</h2>
              </div>
              <div className="row">
                <div className="col-1 p-2" style={{width: 50}}>
                  Name
                </div>
                <div className="col">
                  <input type="text" value={name} onChange={handleNameChange} className="form-control form-control-lg bg-light fs-6" required/>
                </div>
              </div>
              <div className="row">
                <div className="col-1 p-2" style={{width: 50}}>
                  Email
                </div>
                <div className="col">
                  <input type="email" value={formattedEmail} className="form-control form-control-lg bg-light fs-6" readOnly/>
                </div>
                <div className="col-2 p-2" style={{width: 80}}>
                  <a href="#">Thay đổi</a>
                </div>
              </div>
              <div className="row">
                <div className="col-1 p-2" style={{width: 50}}>
                  Phone
                </div>
                <div className="col">
                  <input type="text" value={formattedPhone} className="form-control form-control-lg bg-light fs-6" readOnly/>
                </div>
                <div className="col-2 p-2" style={{width: 80}}>
                  <a href="#">Thay đổi</a>
                </div>
              </div>
              <div className="input-group ">
                <button 
                  onClick={handleFormSubmit} 
                  className="btn btn-lg btn-primary fs-6 fw-bold" style={{marginLeft: 50}}>Save</button>
              </div>
            </div>
          </div>
          <div className="left-contents position-relative bg-light rounded-3 col-md-5 d-flex justify-content-center align-items-center flex-column left-box"> 
            <div className="row">
              <div className="col">
                <button onClick={handleHomeClick} className='profile-button btn btn-outline-secondary position-absolute top-0 start-0 rounded-5 border-0'>
                  <FaHome className='profile-icon'/>
                </button>
              </div>
              <div onClick={handleBackClick} className="col">
                <button className='profile-button btn btn-outline-secondary position-absolute top-0 end-0 rounded-5 border-0'>
                  <FaBackward className='profile-icon'/>
                </button>
              </div>
            </div>
            <div className="profile-picture">
              {image && <img src={"http://localhost:8000/uploads/"+ image}/>}
              <label className='text-center'>
                Change profile picture
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
