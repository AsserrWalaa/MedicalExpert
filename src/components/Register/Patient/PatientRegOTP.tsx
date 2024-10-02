import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../../assets/imgs/new logo.webp";

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
  } = useForm<OTPFormInputs>({
    defaultValues: {
      email: initialEmail, // Set initial value of email field
    },
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<OTPFormInputs> = async (data) => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/patient/verify",
        {
          email: data.email, // Use email from form input
          otp: data.otp,
        }
      );

      if (response.data.status === "success") {
        setSuccessMessage("OTP verified successfully!"); // Set success message
        navigate("/patient-home");
      } else {
        setErrorMessage(response.data.message || "OTP verification failed.");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        // Handle error response
        setErrorMessage(
          errorData.message || "Error verifying OTP. Please try again."
        );
      } else {
        setErrorMessage("Error verifying OTP. Please try again.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="vh-100 user-backgrond">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mt-4 user-form ">
              <div className="card-body ">
                <h2 className="card-title text-center">Verify OTP</h2>
                {/* Adjust logo size here */}
                <img
                  src={logo}
                  className="d-block my-3 mx-auto"
                  alt="Hero"
                  height={180}
                  width={200}
                />
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
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}>
                      {loading ? "Verifying..." : "Verify OTP"}
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
