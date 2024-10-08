import React, { useState } from "react";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Registration: React.FC = () => {
  const [role, setRole] = useState<string>(""); // State to track the selected role
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Navigate based on the selected role
    switch (role) {
      case "doctor":
        navigate("/doctor-signin");
        break;
      case "pharmacist":
        navigate("/pharmacy-signin");
        break;
      case "laboratory":
        navigate("/lab-signin");
        break;
      default:
        break;
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card
        className="shadow-lg w-100"
        style={{ maxWidth: "30rem", borderRadius: "1rem" }}>
        <Card.Body className="p-4">
          <Card.Title className="text-center mb-4 fs-3 fw-bold text-primary">
            Register
          </Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-3">
              <Form.Label
                as="legend"
                column
                xs={12}
                sm={4}
                className="fw-bold text-secondary text-center text-sm-start">
                Register as:
              </Form.Label>
              <Col xs={12} sm={8}>
                <Form.Check
                  type="radio"
                  label="Doctor"
                  name="role"
                  value="doctor"
                  checked={role === "doctor"}
                  onChange={(e) => setRole(e.target.value)}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  label="Pharmacy"
                  name="role"
                  value="pharmacist"
                  checked={role === "pharmacist"}
                  onChange={(e) => setRole(e.target.value)}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  label="Laboratory"
                  name="role"
                  value="laboratory"
                  checked={role === "laboratory"}
                  onChange={(e) => setRole(e.target.value)}
                  className="mb-2"
                />
              </Col>
            </Form.Group>

            <div className="d-flex justify-content-center">
              <Button
                variant="primary"
                type="submit"
                disabled={!role}
                className="fw-bold py-2">
                Continue
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Registration;
