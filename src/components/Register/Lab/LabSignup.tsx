import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../index.css";

// Define the validation schema using Zod
const schema = z.object({
  laboratoryName: z
    .string()
    .min(4, "Laboratory name must be at least 4 characters")
    .max(30, "Laboratory name must be at most 30 characters")
    .nonempty("Laboratory name is required"),
  email: z
    .string()
    .email("Please enter a valid email")
    .nonempty("Email is required"),
  laboratoryId: z
    .string()
    .regex(/^\d+$/, "Please enter a valid laboratory ID")
    .nonempty("Laboratory ID is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must have at least one uppercase letter")
    .regex(/[a-z]/, "Password must have at least one lowercase letter")
    .regex(/\d/, "Password must have at least one number")
    .regex(/[@$!%*?&#]/, "Password must have at least one special character")
    .nonempty("Password is required"),
  confirmPassword: z.string().nonempty("Confirm password is required"),
});

// Type inferred from the schema
type SchemaType = z.infer<typeof schema>;

const LaboratorySignUp: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SchemaType>();

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords must match",
      });
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setModalMessage("");

    try {
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/lab/register",
        {
          name: data.laboratoryName,
          email: data.email,
          password: data.password,
          password_confirmation: data.confirmPassword,
          lab_id: data.laboratoryId,
        }
      );

      if (response.data.status === "success") {
        setModalMessage(
          "Registration successful! Please check your email for OTP verification."
        );
        // Pass the email as a query parameter
        navigate(`/lab-reg-otp?email=${encodeURIComponent(data.email)}`);
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-100 backgound">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mt-4 mb-3">
              <div className="card-body">
                <h2 className="card-title text-center">Laboratory SignUp</h2>

                {/* Error Alert */}
                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}
                {/* Success Alert */}
                {modalMessage && (
                  <div className="alert alert-success" role="alert">
                    {modalMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Laboratory Name */}
                  <div className="mb-3">
                    <label className="form-label">Laboratory Name</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.laboratoryName ? "is-invalid" : ""
                      }`}
                      {...register("laboratoryName", {
                        required: "Laboratory name is required",
                      })}
                    />
                    {errors.laboratoryName && (
                      <div className="invalid-feedback">
                        {errors.laboratoryName?.message}
                      </div>
                    )}
                  </div>

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
                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email?.message}
                      </div>
                    )}
                  </div>

                  {/* Laboratory ID */}
                  <div className="mb-3">
                    <label className="form-label">Laboratory ID</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.laboratoryId ? "is-invalid" : ""
                      }`}
                      {...register("laboratoryId", {
                        required: "Laboratory ID is required",
                      })}
                    />
                    {errors.laboratoryId && (
                      <div className="invalid-feedback">
                        {errors.laboratoryId?.message}
                      </div>
                    )}
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
                          required:
                            "Password must contain an uppercase letter, lowercase letter, symbols, and numbers",
                        })}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setPasswordVisible(!passwordVisible)}>
                        {passwordVisible ? "Hide" : "Show"}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-danger">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <div className="input-group">
                      <input
                        type={confirmPasswordVisible ? "text" : "password"}
                        className={`form-control ${
                          errors.confirmPassword ? "is-invalid" : ""
                        }`}
                        {...register("confirmPassword", {
                          required: "Confirm password is required",
                        })}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setConfirmPasswordVisible(!confirmPasswordVisible)
                        }>
                        {confirmPasswordVisible ? "Hide" : "Show"}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-danger">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Sign Up Button */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}>
                      {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                  </div>

                  {/* Already have an account */}
                  <div className="text-center mt-3">
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={() => navigate("/lab-signin")}>
                      Already have an account? Sign In
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

export default LaboratorySignUp;
