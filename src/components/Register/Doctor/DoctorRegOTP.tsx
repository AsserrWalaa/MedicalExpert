import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../index.css";

// Define the form input types
type OTPFormInputs = {
  email: string;
  otp: string;
};

// Function to parse query parameters from URL
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const DoctorOTPVerification: React.FC = () => {
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
  const [timeLeft, setTimeLeft] = useState(60); // OTP expiration countdown
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

  // Form submission handler for OTP verification
  const onSubmit: SubmitHandler<OTPFormInputs> = async (data) => {
    try {
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/doctor/verify", // API endpoint
        {
          email: data.email, // Email from form
          otp: data.otp, // OTP from form
        }
      );

      if (response.data.status === "success") {
        setErrorMessage(null); // Clear any previous errors
        navigate("/home"); // Navigate to the home page on successful verification
      } else {
        setErrorMessage(response.data.message || "OTP verification failed.");
        setSuccessMessage(null); // Clear success messages on failure
      }
    } catch (error) {
      setSuccessMessage(null); // Clear success messages on error
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
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

  // Handler for resending OTP
  const resendOTP = async () => {
    try {
      const email = watch("email"); // Get the email value from form
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/doctor/get-otp", // Resend OTP endpoint
        {
          email: email, // Only email is required for resending OTP
        }
      );
      if (response.data.status === "success") {
        setSuccessMessage("A new OTP has been sent to your email.");
        setErrorMessage(null); // Clear any error messages
        setResendDisabled(true);
        setTimeLeft(60); // Reset the countdown timer
      } else {
        setErrorMessage(response.data.message || "Failed to resend OTP.");
        setSuccessMessage(null); // Clear success messages on failure
      }
    } catch (error) {
      setSuccessMessage(null); // Clear success messages on error
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
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
    <div className="vh-100 backgound">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 mt-5">
            <div className="card mt-5">
              <div className="card-body">
                <h2 className="card-title text-center">Verify OTP</h2>

                {/* Error and Success Alerts */}
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
                      className={`form-control ${
                        errors.otp ? "is-invalid" : ""
                      }`}
                      {...register("otp", {
                        required: "OTP is required",
                        minLength: {
                          value: 6,
                          message: "OTP must be 6 digits",
                        },
                        maxLength: {
                          value: 6,
                          message: "OTP must be 6 digits",
                        },
                      })}
                    />
                    <div className="invalid-feedback">
                      {errors.otp?.message}
                    </div>
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
                    {resendDisabled
                      ? `Resend OTP in ${timeLeft}s`
                      : "Resend OTP"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorOTPVerification;
