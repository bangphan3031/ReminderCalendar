import {Link} from "react-router-dom";
import axiosClient from "../axios-client.js";
import {createRef} from "react";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import { useState } from "react";
import { Container, Col, Row, Button, Form, InputGroup, FormControl} from 'react-bootstrap';
import { FaGoogle } from "react-icons/fa";

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
    <Container fluid className="p-3 my-5 h-custom">

      <Row>

        <Col xs='10' md='6' className="d-flex align-items-center">
          <img src="https://www.psd.ca/uploads/calendarbanner5.png" className="img-fluid"/>
        </Col>

        <Col xs='10' md='6'>

          <div className="d-flex flex-row align-items-center justify-content-center">

            <Button type="button" className="mt-3 mb-3 btn-google btn"
                variant="outline-danger"
                onClick={handleGoogleLogin}
              ><FaGoogle /> Log in with Google
            </Button>

          </div>

          <div className="divider d-flex align-items-center my-4">
            <p className="text-center fw-bold mx-3 mb-0">Or</p>
          </div>

          <Form.Group className="mb-4" onSubmit={onSubmit}>
            <Form.Label>Email address</Form.Label>
            <InputGroup>
              <FormControl ref={emailRef} type="email" placeholder="Email" />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <FormControl ref={passwordRef} type="password" placeholder="Password" 
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter') {
                    onSubmit(ev);
                  }
                }} 
              />
            </InputGroup>
          </Form.Group>

          <div className="d-flex justify-content-between mb-4">
            <Form.Check type='checkbox' id='flexCheckDefault' label='Remember me' />
            <a href="!#">Forgot password?</a>
          </div>
          <div className='text-center text-md-start mt-4 pt-2 btn-primary'>
            <Button size='lg' onClick={onSubmit}>Login</Button>
            <p className="small fw-bold mt-2 pt-1 mb-2">Don't have an account? <Link to="/signup" className="link-danger">Signup</Link></p>
          </div>

        </Col>

      </Row>
    </Container>
  );
}