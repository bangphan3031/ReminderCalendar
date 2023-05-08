import { Link } from "react-router-dom"
import {useRef, useState} from "react";
import axiosClient from "../axios-client"
import {useStateContext} from "../contexts/ContextProvider"
import logo from '../assets/TamNhuLogo.jpg';

export default function Register() {

    const nameRef = useRef();
    const emailRef = useRef();
    const phoneRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();
    const [errorMessage, setErrorMessage] = useState('');

    const {setUser, setToken} = useStateContext()

    const onSubmit = (ev) => {
        ev.preventDefault()
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value, 
            phone: phoneRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value,
        }
        axiosClient.post('/register', payload)
            .then(({data}) => {
                alert('Đăng ký thành công! Vui lòng xác thực tài khoản email để có thể đăng nhập.')
            })
            .catch(error => {
                setErrorMessage(error.response.data.error);
            })
    }

    return (
        <div className="register-page">
            <div className="container d-flex justify-content-center align-items-center min-vh-100">
                <div className="row border rounded-4 p-3 bg-white shadow box-area">
                <div className="col-6 right-box-register">
                    <div className="row align-items-center">
                    <div className="header-text mb-3 text-center">
                        {/* <img src={logo} className="img-fluid" width={100}/> */}
                        <h2>Sign Up</h2>
                    </div>
                    <div className="error-message">
                        {errorMessage && <p>{errorMessage}</p>}
                    </div>
                    <div className="input-group mb-3">
                        <input ref={nameRef} type="text" className="form-control form-control-lg bg-light fs-6" placeholder="Name" required/>
                    </div>
                    <div className="input-group mb-3">
                        <input ref={emailRef} type="email" className="form-control form-control-lg bg-light fs-6" placeholder="Email" required/>
                    </div>
                    <div className="input-group mb-3">
                        <input ref={phoneRef} type="text" className="form-control form-control-lg bg-light fs-6" placeholder="Phone number" required/>
                    </div>
                    <div className="input-group mb-3">
                        <input ref={passwordRef} type="password" className="form-control form-control-lg bg-light fs-6" placeholder="Password" required/>
                    </div>
                    <div className="input-group mb-1">
                        <input type="password" ref={passwordConfirmationRef}
                        onKeyDown={(ev) => {
                        if (ev.key === 'Enter') {
                            onSubmit(ev);
                        }
                        }}  
                        className="form-control form-control-lg bg-light fs-6" placeholder="Comfirm Password" required/>
                    </div>
                    <div className="input-group mb-4 d-flex justify-content-between">
                        <div className="form-check">
                        <input type="checkbox" className="form-check-input"/>
                        <label htmlFor="formCheck" className="form-check-lable text-secondary"><small>I agree all statements in <Link to="#" className="link-primary fw-bold text-decoration-none">Terms of service</Link></small></label>
                        </div>
                    </div>
                    <div className="input-group mb-3">
                        <button onClick={onSubmit} className="btn btn-lg btn-primary w-100 fs-6 fw-bold">Register</button>
                    </div>
                    <div className="row">
                        <small>Have already an account? <Link to="/login" className="link-primary fw-bold text-decoration-none">Sign in</Link></small>
                    </div>
                    </div>
                </div>
                <div className="left-content col-md-6 rounded-3 d-flex justify-content-center align-items-center flex-column left-box"> 
                </div>
                </div>
            </div>
        </div>
    )
}