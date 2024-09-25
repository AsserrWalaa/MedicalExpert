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

const PharmacyOTPVerification: React.FC = () => {
  const query = useQuery();
  const initialEmail = query.get("email") || ""; // Get email from URL parameters
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch, // Use watch to track form values
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
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [timeLeft]);

  const onSubmit: SubmitHandler<OTPFormInputs> = async (data) => {
    try {
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/pharmacy/verify",
        {
          email: data.email, // Use email from form input
          otp: data.otp,
        }
      );

      if (response.data.status === "success") {
        navigate("/home");
      } else {
        setErrorMessage(response.data.message || "OTP verification failed.");
      }
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const resendOTP = async () => {
    try {
      const email = watch("email"); // Use watch to get the email value
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/pharmacy/get-otp",
        { email } // Include email in the request
      );

      if (response.data.status === "success") {
        setSuccessMessage("A new OTP has been sent to your email.");
        setResendDisabled(true);
        setTimeLeft(10); // Reset countdown
      } else {
        setErrorMessage(response.data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const handleErrorResponse = (error: any) => {
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
                {/* Email Input (read-only) */}
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    {...register("email")}
                  />
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

export default PharmacyOTPVerification;
