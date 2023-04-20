import { Link } from "react-router-dom"
import {useRef, useState} from "react";
import axiosClient from "../axios-client"
import {useStateContext} from "../contexts/ContextProvider"

export default function Register() {

    const nameRef = useRef();
    const emailRef = useRef();
    const phoneRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();
    const [errors, setErrors] = useState(null)

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
                setUser(data.user)
                setToken(data.token)
            })
            .catch(err => {
                const response = err.response;
                if(response && response.status === 400 ) {
                    setErrors(response.data.co)
                }
            })
    }

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Signup</h1>
                    {errors && <div className="alert" >
                            {Object.keys(errors).map(key => (
                                <p key={key}>{errors[key][0]}</p>
                            ))}
                        </div>
                    }
                    <input ref={nameRef} placeholder="Full name" type="text" />
                    <input ref={emailRef} placeholder="Email" type="email" />
                    <input ref={phoneRef} placeholder="Phone" type="phone" />
                    <input ref={passwordRef} placeholder="Password" type="password" />
                    <input ref={passwordConfirmationRef} placeholder="Password Confirmation" type="password" />
                    <button className="btn btn-block">Signup</button>
                    <p className="message">
                        Allready Registered? <Link to="/login">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}