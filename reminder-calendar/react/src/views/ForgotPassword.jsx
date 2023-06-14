import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import axiosClient from '../axios-client';

export default function ForgotPassword(props) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCloseClick = () => {
        props.onClose();
    };

    const handleSubmit = (ev) => {
        ev.preventDefault();
        setLoading(true);
        const payload = {
            email: email
        };
        axiosClient.post('/forgot-password', payload)
        .then((response) => {
            props.onClose()
            setLoading(false);
            console.log(response.data);
            alert('Mật khẩu mới đã được gửi đến email của bạn!');
        })
        .catch((error) => {
            console.error(error.response.data);
            setError(error.response.data.message);
            setLoading(false);
        });
    };

    return (
        <div className="forgot-pasword justify-content-center align-items-center w-100">
          <form className="forgot-password rounded-3" onSubmit={handleSubmit}>
            <header className="px-3 py-1 d-flex align-items-center">
              <b className="m-1">Forgot Password</b>
              <button
                onClick={handleCloseClick}
                title="Close"
                className="close btn btn-outline-secondary border-0 rounded-5"
              >
                <FaTimes />
              </button>
            </header>
            <div className="p-3">
              {error && <p className="text-danger">{error}</p>}
            </div>
            <div className="row p-3 pt-0">
              <div className="col">
                <input
                  type="text"
                  placeholder="Your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="form-control border-0 border-bottom text-xl w-100"
                  required
                />
              </div>
            </div>
            <div className="row p-3 d-flex justify-content-end">
              <div className="col-12">
                <button
                  className="btn btn-secondary fw-bold w-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Send new password'}
                </button>
              </div>
            </div>
          </form>
        </div>
      );
}
