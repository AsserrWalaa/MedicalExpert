import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

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

const DoctorSignIn: React.FC = () => {
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
        "https://admin.medicalexpertise.net/api/doctor/login",
        {
          email: data.email,
          password: data.password,
        }
      );

      console.log("API Response:", response.data);

      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.token);
        setSuccessMessage("Login successful.");
        setErrorMessage(null);
        navigate("/home");
      } else {
        setErrorMessage("Invalid email or password.");
        setSuccessMessage(null);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("API Error:", error.response);
        setErrorMessage("Incorrect email or password.");
        setSuccessMessage(null);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
        setSuccessMessage(null);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center">Doctor SignIn</h2>
              {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
              )}
              {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
              )}
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email Input */}
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    {...register("email")}
                  />
                  <div className="invalid-feedback">
                    {errors.email?.message}
                  </div>
                </div>

                {/* Password Input */}
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      {...register("password")}
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
                <div className="d-grid mb-3">
                  <button type="submit" className="btn btn-primary">
                    Sign In
                  </button>
                </div>
              </form>

              {/* Forgot Password Link */}
              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => navigate("/doctor-forgot")}>
                  Forgot Password?
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => navigate("/doctor-signup")}>
                  Don't have an account?
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSignIn;
