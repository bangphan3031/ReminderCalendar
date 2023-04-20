import {Link} from "react-router-dom";
import axiosClient from "../axios-client.js";
import {createRef} from "react";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import { useState } from "react";

export default function Login() {
  const emailRef = createRef()
  const passwordRef = createRef()
  const { setUser, setToken } = useStateContext()
  const [message, setMessage] = useState(null)

  const onSubmit = ev => {
    ev.preventDefault()

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    axiosClient.post('/login', payload)
      .then(({data}) => {
        setUser(data.user)
        setToken(data.token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 400) {
          setMessage(response.data.message)
        }
      })
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
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form>
          <h1 className="title">Login into your account</h1>

          {message &&
            <div className="alert">
              <p>{message}</p>
            </div>
          }

          <input ref={emailRef} type="email" placeholder="Email"/>
          <input ref={passwordRef} type="password" placeholder="Password"/>
          <button className="btn btn-block" onClick={onSubmit}>Login</button>
          <button className="btn-google" onClick={handleGoogleLogin}>
            <i className="fab fa-google"></i> Sign in with Google
          </button>
          <p className="message">Not registered? <Link to="/register">Create an account</Link></p>
        </form>
      </div>
    </div>
  )
}