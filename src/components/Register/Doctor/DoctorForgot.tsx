import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
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
  const [resendTimer, setResendTimer] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
  } = useForm<SchemaType>({
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    setLoading(true);
    setModalMessage(null);

    if (!otpSent) {
      // Send OTP logic
      try {
        const response = await axios.post(
          "https://admin.medicalexpertise.net/api/doctor/password/forgot",
          { email: data.email }
        );
        console.log("OTP sent successfully:", response.data);
        setOtpSent(true);
        setModalMessage("OTP sent successfully! Please check your email.");
        setShowModal(true); // Show modal on success
      } catch (error) {
        console.error("Error sending OTP:", error);
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data?.message ||
            "Failed to send OTP. Please try again.";
          setError("email", { type: "manual", message });
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Verify OTP logic
      try {
        const response = await axios.post(
          "https://admin.medicalexpertise.net/api/doctor/password/forgot",
          { email: data.email }
        );
        console.log("OTP verified successfully:", response.data);
        setModalMessage("OTP verified! Redirecting to reset password...");
        setShowModal(true); // Show modal on OTP verification
        navigate("/doctor-reset");
      } catch (error) {
        console.error("Error verifying OTP:", error);
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data?.message || "Invalid OTP. Please try again.";
          setModalMessage(message);
          setShowModal(true); // Show modal on error
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer === null || resendTimer <= 0) {
      setLoading(true);
      try {
        const response = await axios.post(
          "https://admin.medicalexpertise.net/api/doctor/password/forgot",
          { email: getValues("email") }
        );
        console.log("OTP resent successfully:", response.data);
        setResendTimer(60);
        setModalMessage("OTP resent successfully!");
        setShowModal(true);
      } catch (error) {
        console.error("Error resending OTP:", error);
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data?.message ||
            "Failed to resend OTP. Please try again.";
          setError("email", { type: "manual", message });
          setModalMessage(message);
          setShowModal(true); // Show modal on resend error
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // Timer for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer !== null && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => (prev ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Modal close handler
  const handleClose = () => setShowModal(false);

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
                    {...register("email", { required: "Email is required" })}
                    readOnly={otpSent}
                  />
                  <div className="invalid-feedback">
                    {errors.email?.message}
                  </div>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}>
                    {loading
                      ? otpSent
                        ? "Verifying OTP..."
                        : "Sending OTP..."
                      : otpSent
                      ? "Verify OTP"
                      : "Send OTP"}
                  </button>
                </div>
              </form>

              <div className="text-center mt-3">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={handleResendOtp}
                  disabled={resendTimer !== null && resendTimer > 0}>
                  {resendTimer ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for messages */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{otpSent ? "Success" : "Error"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant={otpSent ? "success" : "danger"}
            onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ForgotPasswordRequest;
