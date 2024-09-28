import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../../Auth";

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

type AdminSignInFormInputs = z.infer<typeof schema>;

const AdminSignIn: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setUser, setToken } = useAuth(); // Get context functions
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<AdminSignInFormInputs>();

  const onSubmit: SubmitHandler<AdminSignInFormInputs> = async (data) => {
    setErrorMessage(null); // Clear previous errors

    try {
      setLoading(true);
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/admin/login",
        {
          email: data.email,
          password: data.password,
        }
      );

      const { admin, token } = response.data;
      console.log(response.data);

      if (response.data.status === "error") {
        // Handle specific error response from the API
        setErrorMessage(
          "Invalid credentials. Please check your email and password."
        );
        return; // Exit early
      }
      localStorage.setItem("user", JSON.stringify(admin));
      localStorage.setItem("token", token);
      console.log(admin);
      console.log(token);

      setUser(admin);
      setToken(token);
      navigate("/home");
    } catch (error: any) {
      if (error.response?.status === 401) {
        setErrorMessage("Invalid credentials. Please try again.");
      } else if (error.response?.status === 500) {
        setErrorMessage("Server error. Please try again later.");
      } else {
        setErrorMessage(
          error.response?.data?.message || "Sign in failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
      clearErrors();
    }
  };

  return (
    <div className="vh-100 backgound">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 mt-5">
            <div className="card mt-5">
              <div className="card-body">
                <h2 className="card-title text-center">Admin Sign In</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      {...register("email", {
                        required: "Email is required",
                      })}
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

                  {/* Remember Me */}
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      {...register}
                    />
                    <label className="form-check-label">Remember Me</label>
                  </div>

                  {/* Sign In Button */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}>
                      {loading ? "Signing In..." : "Sign In"}
                    </button>
                  </div>

                  {/* Error Message */}
                  {errorMessage && (
                    <div className="text-danger text-center mt-3">
                      {errorMessage}
                    </div>
                  )}

                  {/* Forgot Password */}
                  <div className="text-center mt-3">
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={() => navigate("/admin-forgot")}>
                      Forgot Password?
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

export default AdminSignIn;
