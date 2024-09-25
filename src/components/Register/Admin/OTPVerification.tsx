import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

// Define the validation schema using Zod
const otpSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .nonempty("Email is required"),
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .nonempty("OTP is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
});

type OTPSchemaType = z.infer<typeof otpSchema>;

const OTPVerification: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalVariant, setModalVariant] = useState<"success" | "danger">(
    "success"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<OTPSchemaType>();
  const navigate = useNavigate();

  const handleClose = () => setShowModal(false);

  const onSubmit: SubmitHandler<OTPSchemaType> = async (data) => {
    const parsed = otpSchema.safeParse(data);

    if (!parsed.success) {
      parsed.error.errors.forEach((err) => {
        setError(err.path[0] as keyof OTPSchemaType, { message: err.message });
      });
      return;
    }

    try {
      // Make API call to verify OTP and reset password
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/doctor/password/reset",
        {
          email: data.email,
          otp: data.otp,
          password: data.password,
        }
      );

      // Handle successful response
      if (response.status === 200) {
        setModalTitle("Success");
        setModalMessage("OTP verified and password reset successfully.");
        setModalVariant("success");
        setShowModal(true);

        // Navigate to the sign-in page after success
        setTimeout(() => {
          navigate("/admin-signin");
        });
      } else {
        // Handle failure response
        setModalTitle("Error");
        setModalMessage("Failed to verify OTP or reset password.");
        setModalVariant("danger");
        setShowModal(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setModalTitle("Error");
        setModalMessage("Invalid OTP. Please try again.");
        setModalVariant("danger");
        setShowModal(true);
      } else {
        setModalTitle("Error");
        setModalMessage("An unexpected error occurred.");
        setModalVariant("danger");
        setShowModal(true);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">
                Enter OTP and New Password
              </h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email Input */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                  />
                  <p className="text-danger">{errors.email?.message}</p>
                </div>

                {/* OTP Input */}
                <div className="mb-3">
                  <label htmlFor="otp" className="form-label">
                    OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    {...register("otp")}
                    className={`form-control ${errors.otp ? "is-invalid" : ""}`}
                  />
                  <p className="text-danger">{errors.otp?.message}</p>
                </div>

                {/* Password Input */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    {...register("password")}
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                  />
                  <p className="text-danger">{errors.password?.message}</p>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Verify OTP and Reset Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for showing messages */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className={
            modalVariant === "danger" ? "text-danger" : "text-success"
          }>
          {modalMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant={modalVariant === "danger" ? "danger" : "success"}
            onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OTPVerification;
