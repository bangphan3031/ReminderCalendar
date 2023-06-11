import React, { useState } from 'react';
import { useEffect } from "react";
import axiosClient from '../axios-client';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaBackward } from "react-icons/fa";
import { Watch } from 'react-loader-spinner'

export default function Profile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // Thêm state mới để lưu trữ URL của ảnh được chọn
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
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  const formattedPhone = phone.slice(0,3) + '****' + phone.slice(-3);
  const formattedEmail = email.slice(0,5) + '*********' + email.slice(-10);

  const handleNameChange = (event) => {
      setName(event.target.value);
  }

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
    // Tạo URL tạm thời cho ảnh được chọn
    const imageObjectURL = URL.createObjectURL(event.target.files[0]);
    setPreviewImage(imageObjectURL);
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
  
        // Cập nhật đường dẫn ảnh sau khi upload thành công
        setImage(uploadResponse.data.image);
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
      {isLoading ? (
        <div className="loading-overlay-profile">
          <Watch
            height={100}
            width={100}
            color="#0d6efd"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor="#4fa94d"
            strokeWidth={5}
            strokeWidthSecondary={2}
          />
        </div>
      ) : (
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
              <div className="input">
                <button 
                  onClick={handleFormSubmit} 
                  className="btn btn-lg btn-primary fs-6 fw-bold" style={{marginLeft: 50}}>
                  Save
                </button>
                <button 
                  onClick={handleFormSubmit} 
                  className="btn btn-lg btn-primary fs-6 fw-bold" style={{marginLeft: 50}}>
                  Change Password
                </button>
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
              {previewImage && <img src={previewImage} alt="Preview" />}
              {!previewImage && image && <img src={"http://localhost:8000/uploads/"+ image} alt="Profile" />}
              <label className='text-center'>
                Change profile picture
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
