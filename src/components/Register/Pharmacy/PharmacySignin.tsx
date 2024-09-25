import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Define the validation schema using Zod
const schema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must have at least one uppercase letter")
    .regex(/[a-z]/, "Password must have at least one lowercase letter")
    .regex(/\d/, "Password must have at least one number")
    .regex(/[@$!%*?&#]/, "Password must have at least one special character")
    .nonempty("Password is required"),
});

// Type inferred from the schema
type SchemaType = z.infer<typeof schema>;

const PharmacySignIn: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaType>();

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    try {
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/pharmacy/login", // Replace with your API endpoint
        data
      );

      // Debugging: Log the response data to inspect its structure
      console.log("API Response:", response.data);

      if (response.data.status === "success") {
        // Save the token and other user data if needed
        localStorage.setItem("token", response.data.token);
        setSuccessMessage(response.data.message || "Login successful.");
        setErrorMessage(null); // Clear error message
        navigate("/home"); // Navigate to the home page
      } else {
        setErrorMessage(response.data.message || "Invalid email or password.");
        setSuccessMessage(null); // Clear success message
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Log the error details for debugging
        console.error("API Error:", error.response);
        setErrorMessage("Email or password is not correct.");
        setSuccessMessage(null); // Clear success message
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
        setSuccessMessage(null); // Clear success message
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Pharmacy Sign In</h2>
              {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
              )}
              {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
              )}
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    {...register("email", { required: "Email is required" })}
                  />
                  <div className="invalid-feedback">
                    {errors.email?.message}
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      {...register("password", {
                        required: "Password is required",
                      })}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setPasswordVisible(!passwordVisible)}>
                      {passwordVisible ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div className="invalid-feedback">
                    {errors.password?.message}
                  </div>
                </div>

                {/* Sign In Button */}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Sign In
                  </button>
                </div>

                {/* Forgot Password */}
                <div className="text-center mt-3">
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => navigate("/pharmacy-forgot")}>
                    Forgot Password?
                  </button>
                </div>

                {/* Don't have an account */}
                <div className="text-center mt-3">
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => navigate("/pharmacy-signup")}>
                    Don't have an account? Sign Up
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

export default PharmacySignIn;
