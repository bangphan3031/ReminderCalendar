import {Link} from "react-router-dom";
import axiosClient from "../axios-client.js";
import {createRef} from "react";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import { useState } from "react";
import '../css/example.css'
import { FaGoogle } from "react-icons/fa";
import logo from '../assets/TamNhuLogo.jpg';
import { Oval } from 'react-loader-spinner'

export default function Login() {
  const emailRef = createRef()
  const passwordRef = createRef()
  const { setUser, setToken } = useStateContext()
  const [erEmail, setErEmail] = useState('');
  const [erPassword, setErPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = ev => {
    ev.preventDefault()

    setLoading(true);

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    
    axiosClient.post('/login', payload)
      .then(({data}) => {
        setLoading(false);
        setUser(data.user);
        setToken(data.token);
      })
      .catch((error) => {
        setLoading(false);
        setErEmail(error.response.data.email);
        setErPassword(error.response.data.password);
        if(error.response.data.error) {
          alert('Email của bạn chưa được xác thực! Vui lòng xác thực email để có thể đăng nhập.')
        }
      })

    setTimeout(() => {
      setLoading(false); // Giả lập kết quả trả về từ API và ẩn trạng thái đang load
      // Chuyển đến trang chủ
    }, 2000);
  }
  const handleGoogleLogin = ev  => {
    ev.preventDefault()
    
    axiosClient.get('/auth/google')
      .then(({data}) => {
        setUser(data.user);
        setToken(data.token);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="login-page">
      {loading && (
        <div className="loading-overlay">
            <Oval
              height={30}
              width={30}
              color="#4fa94d"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel='oval-loading'
              secondaryColor="#4fa94d"
              strokeWidth={5}
              strokeWidthSecondary={2}
            />
            <p>Đang xử lý!</p>
        </div>
      )}
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="row border rounded-4 p-3 bg-white shadow box-area">
          <div className="left-content col-md-6 rounded-3 d-flex justify-content-center align-items-center flex-column left-box"> 
          </div>
          <div className="col-6 right-box">
            <div className="row align-items-center">
              <div className="header-text mb-5 text-center">
                <h2>Sign In</h2>
              </div>
              <div className="input-group">
                <input ref={emailRef} type="email" className="form-control form-control-lg bg-light fs-6" placeholder="Email" required/>
              </div>
              <div className="error-message-login mt-0">
                {erEmail && <p>{erEmail}</p>}
              </div>
              <div className="input-group mt-3">
                <input type="password" ref={passwordRef}
                  onKeyDown={(ev) => {
                  if (ev.key === 'Enter') {
                    onSubmit(ev);
                  }
                  }}  
                  className="form-control form-control-lg bg-light fs-6" placeholder="Password" required/>
              </div>
              <div className="error-message-login mt-0">
                {erPassword && <p>{erPassword}</p>}
              </div>
              <div className="input-group mb-5 d-flex justify-content-between mt-2">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input"/>
                  <label htmlFor="formCheck" className="form-check-lable text-secondary"><small>Remember me</small></label>
                </div>
                <div className="forgot">
                  <small><a href="#">Forgot Password</a></small>
                </div>
              </div>
              <div className="input-group mb-3">
                <button onClick={onSubmit} className="btn btn-lg btn-primary w-100 fs-6 fw-bold">Login</button>
              </div>
              <div className="input-group mb-3">
                <button type="button" onClick={handleGoogleLogin} className="btn btn-lg btn-outline-danger w-100 fs-6 fw-bold"><FaGoogle/><small> Login with Google</small></button>
              </div>
              <div className="row">
                <small>Don't have an account? <Link to="/signup" className="link-primary fw-bold text-decoration-none">Sign up</Link></small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}