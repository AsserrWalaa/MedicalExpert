import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

// Define the form input types
type OTPFormInputs = {
  email: string;
  otp: string;
};

// Function to parse query parameters from URL
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const LaboratoryOTPVerification: React.FC = () => {
  const query = useQuery();
  const initialEmail = query.get("email") || "";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPFormInputs>({
    defaultValues: {
      email: initialEmail,
    },
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<OTPFormInputs> = async (data) => {
    try {
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/lab/verify",
        {
          email: data.email,
          otp: data.otp,
        }
      );

      if (response.data.status === "success") {
        setSuccessMessage("OTP verified successfully!");
        setErrorMessage(null); // Clear error message
        setTimeout(() => {
          navigate("/home");
        }, 2000); // Redirect after 2 seconds
      } else {
        setErrorMessage(response.data.message || "OTP verification failed.");
        setSuccessMessage(null); // Clear success message
      }
    } catch (error) {
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
      setSuccessMessage(null); // Clear success message
    }
  };

  return (
    <div className="vh-100 backgound">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mt-4">
              <div className="card-body">
                <h2 className="card-title text-center">Verify OTP</h2>

                {/* Error Message Alert */}
                {errorMessage && (
                  <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert">
                    {errorMessage}
                  </div>
                )}

                {/* Success Message Alert */}
                {successMessage && (
                  <div
                    className="alert alert-success alert-dismissible fade show"
                    role="alert">
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
                      readOnly
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaboratoryOTPVerification;
