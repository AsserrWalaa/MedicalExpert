import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

// Define the form input types
type OTPFormInputs = {
  email: string; // Added email input
  otp: string;
};

// Function to parse query parameters from URL
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const PatientOTPVerification: React.FC = () => {
  const query = useQuery();
  const initialEmail = query.get("email") || ""; // Get email from URL parameters
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch, // Use watch to access form values
  } = useForm<OTPFormInputs>({
    defaultValues: {
      email: initialEmail, // Set initial value of email field
    },
  });
  const [timeLeft, setTimeLeft] = useState(10); // OTP expiration countdown
  const [resendDisabled, setResendDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Countdown logic for OTP expiration
  useEffect(() => {
    if (timeLeft === 0) {
      setResendDisabled(false);
    } else {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const onSubmit: SubmitHandler<OTPFormInputs> = async (data) => {
    try {
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/patient/verify",
        {
          email: data.email, // Use email from form input
          otp: data.otp,
        }
      );

      if (response.data.status === "success") {
        navigate("/patient-home");
      } else {
        setErrorMessage(response.data.message || "OTP verification failed.");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        // Handle error response
        if (Array.isArray(errorData.errors)) {
          setErrorMessage(
            errorData.errors.map((err: { msg: string }) => err.msg).join(", ")
          );
        } else if (typeof errorData.message === "string") {
          setErrorMessage(errorData.message);
        } else {
          setErrorMessage(
            `Error: ${error.response.status} - ${error.response.statusText}`
          );
        }
      } else {
        setErrorMessage("Error verifying OTP. Please try again.");
      }
    }
  };

  const resendOTP = async () => {
    try {
      const email = watch("email"); // Use watch to get the email value
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/patient/get-otp",
        {
          email: email, // Include email in request
        }
      );
      if (response.data.status === "success") {
        setSuccessMessage("A new OTP has been sent to your email.");
        setResendDisabled(true);
        setTimeLeft(10); // Reset countdown
      } else {
        setErrorMessage(response.data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        // Handle error response
        if (Array.isArray(errorData.errors)) {
          setErrorMessage(
            errorData.errors.map((err: { msg: string }) => err.msg).join(", ")
          );
        } else if (typeof errorData.message === "string") {
          setErrorMessage(errorData.message);
        } else {
          setErrorMessage(
            `Error: ${error.response.status} - ${error.response.statusText}`
          );
        }
      } else {
        setErrorMessage("Error resending OTP. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Verify OTP</h2>
              {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
              )}
              {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
              )}
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email Input */}
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  <div className="invalid-feedback">
                    {errors.email?.message}
                  </div>
                </div>

                {/* OTP Input */}
                <div className="mb-3">
                  <label className="form-label">Enter OTP</label>
                  <input
                    type="text"
                    className={`form-control ${errors.otp ? "is-invalid" : ""}`}
                    {...register("otp", {
                      required: "OTP is required",
                      minLength: { value: 6, message: "OTP must be 6 digits" },
                      maxLength: { value: 6, message: "OTP must be 6 digits" },
                    })}
                  />
                  <div className="invalid-feedback">{errors.otp?.message}</div>
                </div>

                {/* Submit Button */}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Verify
                  </button>
                </div>
              </form>

              {/* Resend OTP */}
              <div className="text-center mt-3">
                <button
                  className="btn btn-link"
                  onClick={resendOTP}
                  disabled={resendDisabled}>
                  {resendDisabled ? `Resend OTP in ${timeLeft}s` : "Resend OTP"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientOTPVerification;
