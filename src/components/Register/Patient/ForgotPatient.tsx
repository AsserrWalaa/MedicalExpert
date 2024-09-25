import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

// Define the validation schema using Zod
const schema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .nonempty("Email is required"),
});

// Type inferred from the schema
type SchemaType = z.infer<typeof schema>;

const PatientForgotPasswordEmail: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaType>();

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    setIsLoading(true); // Set loading state to true
    setErrorMessage(null); // Reset error message on each submit
    setSuccessMessage(null); // Reset success message on each submit

    try {
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/patient/password/forgot", // Replace with your API endpoint
        { email: data.email }
      );

      // Check the response for success condition
      if (response.data) {
        // Display success message and navigate on success
        setSuccessMessage("OTP has been sent to your email.");
        navigate("/patient-forgot-otp"); // Redirect after 2 seconds
      } else {
        // Display error message if the email is invalid or OTP not sent
        setErrorMessage(
          response.data.message ||
            "Failed to send OTP. Please check your email."
        );
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      // Handle and display API errors
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
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
              <h2 className="card-title text-center">Forgot Password</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    {...register("email", { required: true })}
                    required
                  />
                  <div className="invalid-feedback">
                    {errors.email?.message}
                  </div>
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
                    className="btn btn-primary mb-3"
                    disabled={isLoading} // Disable button during loading
                  >
                    {isLoading ? "Sending..." : "Send OTP"}
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

export default PatientForgotPasswordEmail;
