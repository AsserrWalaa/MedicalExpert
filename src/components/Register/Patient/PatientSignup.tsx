import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

// Define the validation schema using Zod
const schema = z.object({
  patientName: z
    .string()
    .min(4, "patientName must be at least 4 characters")
    .max(30, "patientName must be at most 30 characters")
    .nonempty("patientName is required"),
  email: z
    .string()
    .email("Please enter a valid email")
    .nonempty("Email is required"),
  SSN: z
    .string()
    .regex(/^\d+$/, "Please enter a valid patient ID")
    .nonempty("patientId is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must have at least one uppercase letter")
    .regex(/[a-z]/, "Password must have at least one lowercase letter")
    .regex(/\d/, "Password must have at least one number")
    .regex(/[@$!%*?&#]/, "Password must have at least one special character")
    .nonempty("Password is required"),
  confirmPassword: z.string().nonempty("Confirm password is required"),
});

// Type inferred from the schema
type SchemaType = z.infer<typeof schema>;

const PatientSignUp: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Track success or failure
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SchemaType>();

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords must match",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/patient/register",
        {
          name: data.patientName,
          email: data.email,
          password: data.password,
          password_confirmation: data.confirmPassword,
          SSN: data.SSN, // Adjusted key to match expected API structure
        }
      );

      if (response.data.status === "success") {
        setModalMessage(
          "Registration successful. Please complete registration."
        );
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/patient-reg-otp");
        }, 2000);
      } else {
        setModalMessage(
          response.data.message || "Registration failed. Please try again."
        );
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Response data:", error.response.data); // Log server response
        setModalMessage(
          error.response.data.message ||
            "Registration failed. Please try again."
        );
      } else {
        setModalMessage("Registration failed. Please try again.");
      }
      setIsSuccess(false);
    } finally {
      setLoading(false);
      setShowModal(true);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Patient SignUp</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* patientName */}
                <div className="mb-3">
                  <label className="form-label">Patient Name</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.patientName ? "is-invalid" : ""
                    }`}
                    {...register("patientName", { required: true })}
                  />
                  {errors.patientName && (
                    <p className="text-danger">{errors.patientName.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    {...register("email", { required: true })}
                  />
                  {errors.email && (
                    <p className="text-danger">{errors.email.message}</p>
                  )}
                </div>

                {/* patientID */}
                <div className="mb-3">
                  <label className="form-label">Patient ID</label>
                  <input
                    type="text"
                    className={`form-control ${errors.SSN ? "is-invalid" : ""}`}
                    {...register("SSN", { required: true })}
                  />
                  {errors.SSN && (
                    <p className="text-danger">{errors.SSN.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      {...register("password", { required: true })}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setPasswordVisible(!passwordVisible)}>
                      {passwordVisible ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-danger">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-group">
                    <input
                      type={confirmPasswordVisible ? "text" : "password"}
                      className={`form-control ${
                        errors.confirmPassword ? "is-invalid" : ""
                      }`}
                      {...register("confirmPassword", { required: true })}
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
                  {errors.confirmPassword && (
                    <p className="text-danger">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Sign Up Button */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}>
                    {loading ? "Signing Up..." : "Sign Up"}
                  </button>
                </div>

                {/* Already have an account */}
                <div className="text-center mt-3">
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => navigate("/patient-signin")}>
                    Already have an account? Sign In
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {showModal && (
        <div
          className="modal fade show"
          tabIndex={-1}
          style={{ display: "block" }}
          role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isSuccess ? "Success" : "Failure"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <p>{modalMessage}</p>
              </div>
              <div className="modal-footer d-flex">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}>
                  Close
                </button>
                {isSuccess && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigate("/patient-reg-otp")}>
                    Complete Registration
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSignUp;