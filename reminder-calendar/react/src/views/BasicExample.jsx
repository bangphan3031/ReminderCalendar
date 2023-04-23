import { useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { FaGoogle } from "react-icons/fa";
import '../css/Example.css';

function BasicExample() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // your login logic goes here
  };

  const handleGoogleLogin = () => {
    // your Google login logic goes here
  };

  return (
    <Row className="justify-content-center mt-5">
      <Col xs={12} md={6} lg={4}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  label="Remember me"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
              </Form.Group>

              <Button variant="primary" type="submit" block>
                Log In
              </Button>

              <Button
                variant="outline-primary"
                type="button"
                className="mt-3 mb-3 btn-google"
                block
                onClick={handleGoogleLogin}
              >
                <FaGoogle /> Log in with Google
              </Button>

              <div className="text-center">
                <p class="mb-0">Don't have an account? <a href="#!" class="text-white-50 fw-bold">Sign Up</a></p>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default BasicExample;
