import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

// Define form input types
type FormData = {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
};

const PatientOTPVerification: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message state

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // Manual validation
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      setError("email", { message: "Please enter a valid email" });
      return;
    }
    if (!data.otp || !/^\d{6}$/.test(data.otp)) {
      setError("otp", { message: "OTP must be exactly 6 digits" });
      return;
    }
    if (data.password.length < 8) {
      setError("password", {
        message: "Password must be at least 8 characters",
      });
      return;
    }
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }

    setIsLoading(true); // Set loading state to true
    setErrorMessage(null); // Reset error message on each submit
    setSuccessMessage(null); // Reset success message on each submit

    try {
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/patient/password/reset", // Replace with your API endpoint
        {
          email: data.email, // Include email in the request
          otp: data.otp,
          password: data.password,
        }
      );

      console.log("API Response:", response.data);

      // Adjust the success condition based on the actual API response structure
      if (response.data.success) {
        setSuccessMessage("OTP verified successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/patient-login");
        }, 2000); // Delay navigation to show success message
      } else {
        // Set error message if the response indicates failure
        setErrorMessage(
          response.data.message || "Failed to verify OTP. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      // Handle and display API errors
      if (error.response && error.response.data) {
        setErrorMessage(
          error.response.data.message ||
            "Please check the details and try again."
        );
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false); // Set loading state to false after request completion
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Verify OTP</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email Input */}
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    {...register("email", {
                      required: "Email is required",
                    })}
                  />
                  {errors.email && (
                    <p className="text-danger mt-2">{errors.email.message}</p>
                  )}
                </div>

                {/* OTP Input */}
                <div className="mb-3">
                  <label className="form-label">Enter OTP</label>
                  <input
                    type="text"
                    className={`form-control ${errors.otp ? "is-invalid" : ""}`}
                    {...register("otp", {
                      required: "OTP is required",
                    })}
                    maxLength={6}
                    minLength={6}
                  />
                  {errors.otp && (
                    <p className="text-danger mt-2">{errors.otp.message}</p>
                  )}
                </div>

                {/* Password Input */}
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    {...register("password", {
                      required: "Password is required",
                    })}
                    minLength={8}
                  />
                  {errors.password && (
                    <p className="text-danger mt-2">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className={`form-control ${
                      errors.confirmPassword ? "is-invalid" : ""
                    }`}
                    {...register("confirmPassword", {
                      required: "Confirm password",
                    })}
                    minLength={8}
                  />
                  {errors.confirmPassword && (
                    <p className="text-danger mt-2">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Success Message */}
                {successMessage && (
                  <div className="alert alert-success" role="alert">
                    {successMessage}
                  </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}

                {/* Submit Button */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading} // Disable button during loading
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientOTPVerification;
