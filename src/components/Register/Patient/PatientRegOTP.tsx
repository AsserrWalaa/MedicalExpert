import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../../assets/imgs/new logo.webp";

// Define the form input types
type OTPFormInputs = {
  email: string;
  otp: string[]; // Changed otp to be an array of strings (6 digits)
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
    watch,
  } = useForm<OTPFormInputs>({
    defaultValues: {
      email: initialEmail,
      otp: ["", "", "", "", "", ""], // Initial values for the 6 OTP fields
    },
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  // Watch OTP inputs
  const otpValues = watch("otp");

  // Function to handle OTP input navigation (focus next input)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (value.length === 1 && index < 5) {
      const nextField = document.getElementById(`otp-${index + 1}`);
      nextField?.focus();
    }
    if (value.length === 0 && index > 0) {
      const prevField = document.getElementById(`otp-${index - 1}`);
      prevField?.focus();
    }
  };

  // Submit handler for OTP verification
  const onSubmit: SubmitHandler<OTPFormInputs> = async (data) => {
    const otp = data.otp.join(""); // Combine OTP values into a single string
    setLoading(true);
    try {
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/patient/verify-otp",
        {
          email: data.email,
          otp,
        }
      );

      if (response.data.status === "success") {
        setMessage("OTP verified successfully. Please log in.");
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/patient-signin");
        }, 2000);
      } else {
        setMessage(response.data.message || "OTP verification failed.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Response data:", error.response.data);
        setMessage(error.response.data.message || "OTP verification failed.");
      } else {
        setMessage("OTP verification failed.");
      }
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Function to resend OTP
  const resendOTP = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/patient/get-otp",
        { email: initialEmail }
      );

      if (response.data.status === "success") {
        setMessage("OTP has been resent to your email.");
        setIsSuccess(true);
      } else {
        setMessage(response.data.message || "Failed to resend OTP.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Resend OTP failed:", error);
      setMessage("Failed to resend OTP.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 user-backgrond">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mt-4 user-form">
              <div className="card-body">
                <h2 className="card-title text-center">OTP Verification</h2>
                <img
                  src={logo}
                  className="d-block my-3 mx-auto"
                  alt="Hero"
                  height={180}
                  width={200}
                />
                {message && (
                  <div
                    className={`alert ${
                      isSuccess ? "alert-success" : "alert-danger"
                    }`}
                    role="alert">
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Email (Hidden Field) */}
                  <input type="hidden" {...register("email")} />

                  <div className="mb-3 text-center">
                    <label className="form-label">Enter OTP</label>
                    <div className="mb-3 d-flex justify-content-between">
                      {otpValues.map((_, index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength={1}
                          id={`otp-${index}`}
                          className={`form-control mx-1 border-primary fw-bold text-primary text-center ${
                            errors.otp ? "is-invalid" : ""
                          }`}
                          {...register(`otp.${index}`, {
                            required: "OTP is required",
                            maxLength: 1,
                            onChange: (e) => handleInputChange(e, index),
                          })}
                        />
                      ))}
                    </div>
                    {errors.otp && (
                      <p className="text-danger">
                        Please enter a valid 6-digit OTP.
                      </p>
                    )}
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}>
                      {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                  </div>

                  <div className="d-grid mt-2">
                    <button
                      className="btn btn-secondary"
                      onClick={resendOTP}
                      disabled={loading}>
                      {loading ? "Resending OTP..." : "Resend OTP"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientOTPVerification;
