import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

type OTPFormInputs = {
  email: string;
  otp: string;
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
    reset, // Added reset function
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
        "https://admin.medicalexpertise.net/api/pharmacy/verify",
        {
          email: data.email,
          otp: data.otp,
        }
      );

      if (response.data.status === "success") {
        reset(); // Reset the form on success
        setSuccessMessage("OTP verified successfully!"); // Set success message
        setTimeout(() => {
          navigate("/home");
        }, 2000); // Redirect after 2 seconds
      } else {
        setErrorMessage(response.data.message || "OTP verification failed.");
      }
    } catch (error) {
      handleErrorResponse(error);
    }
  };

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

  return (
    <div className="vh-100 backgound">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mt-4">
              <div className="card-body">
                <h2 className="card-title text-center">OTP Verification</h2>

                {/* Success alert */}
                {successMessage && (
                  <div
                    className="alert alert-success alert-dismissible fade show"
                    role="alert">
                    {successMessage}
                    <button
                      type="button"
                      className="close"
                      data-dismiss="alert"
                      aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                )}

                {/* Error alert */}
                {errorMessage && (
                  <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert">
                    {errorMessage}
                    <button
                      type="button"
                      className="close"
                      data-dismiss="alert"
                      aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      readOnly
                      value={initialEmail}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">OTP</label>
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

                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                      Verify OTP
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

export default PharmacyOTPVerification;
