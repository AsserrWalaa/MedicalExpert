import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button } from "react-bootstrap"; // Import Modal and Button
import "bootstrap/dist/css/bootstrap.min.css";

// Define the validation schema using Zod
const schema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .nonempty("Email is required"),
});

type SchemaType = z.infer<typeof schema>;

const ForgotPasswordRequest: React.FC = () => {
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState<string | null>(null); // State to hold modal message
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SchemaType>();

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    try {
      // Perform manual validation with Zod schema
      schema.parse(data);

      // Make API call to send OTP
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/admin/password/forgot",
        { email: data.email } // Send email in the request body
      );

      if (response.status === 200) {
        // Success - show modal with success message
        setModalMessage(`OTP sent successfully to: ${data.email}`);
        setShowModal(true);
        navigate("/admin-otp"); // Navigate after 2 seconds
      } else {
        // API failed
        setModalMessage("Failed to send OTP. Please try again.");
        setShowModal(true);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          setError(err.path[0] as keyof SchemaType, {
            type: "manual",
            message: err.message,
          });
        });
      } else if (axios.isAxiosError(error)) {
        setModalMessage(
          "Failed to send OTP. Please check the email and try again."
        );
        setShowModal(true);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center">Forgot Password</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    {...register("email")}
                  />
                  <div className="invalid-feedback">
                    {errors.email?.message}
                  </div>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Send OTP
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for feedback messages */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ForgotPasswordRequest;
