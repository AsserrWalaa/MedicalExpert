import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

// Define the validation schema using Zod
const schema = z
  .object({
    name: z.string().nonempty("Name is required"),
    email: z
      .string()
      .email("Please enter a valid email")
      .nonempty("Email is required"),
    SSN: z
      .string()
      .regex(/^\d+$/, "SSN must contain only digits")
      .nonempty("SSN is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must have at least one uppercase letter")
      .regex(/[a-z]/, "Password must have at least one lowercase letter")
      .regex(/\d/, "Password must have at least one number")
      .regex(/[@$!%*?&#]/, "Password must have at least one special character")
      .nonempty("Password is required"),
    confirmPassword: z.string().nonempty("Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

// Type inferred from the schema
type SchemaType = z.infer<typeof schema>;

const DoctorSignUp: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for the API call
  const [modalMessage, setModalMessage] = useState(""); // State for modal message
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SchemaType>();

  const handleModalClose = () => {
    setShowModal(false);
    if (modalMessage.includes("successfully")) {
      navigate("/doctor-reg-otp"); // Navigate to OTP verification page on success
    }
  };

  const validateForm = (data: SchemaType) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        setError(issue.path[0] as keyof SchemaType, {
          type: "manual",
          message: issue.message,
        });
      });
      return false;
    }
    return true;
  };

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    // Manual validation
    if (!validateForm(data)) {
      return;
    }

    setLoading(true); // Start loading
    try {
      // Make the API call using Axios with correct payload structure
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/doctor/register",
        {
          name: data.name,
          email: data.email,
          password: data.password,
          password_confirmation: data.confirmPassword,
          SSN: data.SSN,
        }
      );

      // Check if the registration was successful
      if (response.data.status === "success") {
        setModalMessage(
          "Registration successful! Please check your email for OTP verification."
        );
        setShowModal(true); // Show modal with success message
        navigate("/doctor-reg-otp");
      } else {
        setModalMessage("Registration failed. Please try again.");
        setShowModal(true); // Show modal with failure message
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
        setModalMessage(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
      } else {
        console.error("Error:", error);
        setModalMessage("An unexpected error occurred. Please try again.");
      }
      setShowModal(true); // Show modal with error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Doctor Sign Up</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Name Input */}
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    {...register("name", { required: "Name is required" })}
                  />
                  <div className="invalid-feedback">{errors.name?.message}</div>
                </div>

                {/* Email Input */}
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    {...register("email", { required: "Email is required" })}
                  />
                  <div className="invalid-feedback">
                    {errors.email?.message}
                  </div>
                </div>

                {/* SSN Input */}
                <div className="mb-3">
                  <label className="form-label">SSN</label>
                  <input
                    type="text"
                    className={`form-control ${errors.SSN ? "is-invalid" : ""}`}
                    {...register("SSN", { required: "SSN is required" })}
                  />
                  <div className="invalid-feedback">{errors.SSN?.message}</div>
                </div>

                {/* Password Input */}
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      {...register("password", {
                        required: "Password is required",
                      })}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setPasswordVisible(!passwordVisible)}>
                      {passwordVisible ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div className="invalid-feedback">
                    {errors.password?.message}
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-group">
                    <input
                      type={confirmPasswordVisible ? "text" : "password"}
                      className={`form-control ${
                        errors.confirmPassword ? "is-invalid" : ""
                      }`}
                      {...register("confirmPassword", {
                        required: "Confirm password is required",
                      })}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setConfirmPasswordVisible(!confirmPasswordVisible)
                      }>
                      {confirmPasswordVisible ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div className="invalid-feedback">
                    {errors.confirmPassword?.message}
                  </div>
                </div>

                {/* Sign Up Button */}
                <div className="d-grid mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}>
                    {loading ? "Signing Up..." : "Sign Up"}
                  </button>
                </div>
              </form>

              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => navigate("/doctor-signin")}>
                  Already have an account?
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Doctor Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DoctorSignUp;
