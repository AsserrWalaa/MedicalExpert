import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../index.css";

type OTPFormInputs = {
  email: string;
  otp: string; // We'll combine the OTP digits to this field before submission
};

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const PharmacyOTPVerification: React.FC = () => {
  const query = useQuery();
  const initialEmail = query.get("email") || "";
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OTPFormInputs>({
    defaultValues: {
      email: initialEmail,
      otp: "", // Initially empty
    },
  });

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendOtpMessage, setResendOtpMessage] = useState<string | null>(null);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
  const navigate = useNavigate();

  // Function to handle OTP verification
  const onSubmit: SubmitHandler<OTPFormInputs> = async () => {
    const otpString = otp.join(""); // Combine the OTP digits into a single string
    try {
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/pharmacy/verify",
        {
          email: initialEmail,
          otp: otpString,
        }
      );

      if (response.data.status === "success") {
        reset();
        setSuccessMessage("OTP verified successfully!");
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        setErrorMessage(response.data.message || "OTP verification failed.");
      }
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  // Function to handle Resend OTP
  const resendOtp = async () => {
    setErrorMessage(null);
    setResendOtpMessage(null);

    try {
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/pharmacy/get-otp",
        {
          email: initialEmail,
        }
      );

      if (response.data.status === "success") {
        setResendOtpMessage("OTP has been resent successfully!");
        setIsResendDisabled(true); // Disable button for 60 seconds
        setTimeout(() => {
          setIsResendDisabled(false);
        }, 60000); // 1 minute
      } else {
        setErrorMessage(response.data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  // Function to handle error responses
  const handleErrorResponse = (error: any) => {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data;
      setErrorMessage(
        typeof errorData.message === "string"
          ? errorData.message
          : "Error verifying OTP. Please try again."
      );
    } else {
      setErrorMessage("Error verifying OTP. Please try again.");
    }
  };

  // Handle input change for OTP digits
  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last character (in case of more than one)
    setOtp(newOtp);

    // Move focus to the next input if the value is filled
    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  return (
    <div className="vh-100 background">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mt-4">
              <div className="card-body">
                <h2 className="card-title text-center">OTP Verification</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Email (Hidden Field) */}
                  <input type="hidden" {...register("email")} />

                  {/* OTP Inputs */}
                  <div className="mb-3 d-flex justify-content-between">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        id={`otp-input-${index}`}
                        className={`form-control mx-1 border-primary fw-bold text-primary text-center ${
                          errors.otp ? "is-invalid" : ""
                        }`}
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                      />
                    ))}
                  </div>

                  {/* Error/Success Messages */}
                  {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                      {errorMessage}
                    </div>
                  )}
                  {successMessage && (
                    <div className="alert alert-success" role="alert">
                      {successMessage}
                    </div>
                  )}
                  {resendOtpMessage && (
                    <div className="alert alert-info" role="alert">
                      {resendOtpMessage}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="d-grid mb-3">
                    <button type="submit" className="btn btn-primary">
                      Verify OTP
                    </button>
                  </div>
                </form>

                {/* Resend OTP Button */}
                <div className="d-grid">
                  <button
                    className="btn btn-secondary"
                    onClick={resendOtp}
                    disabled={isResendDisabled}>
                    {isResendDisabled
                      ? "Resend OTP (wait 1 minute)"
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

export default PharmacyOTPVerification;
