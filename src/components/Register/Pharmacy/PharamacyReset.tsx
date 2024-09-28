import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

// Define the validation schema using Zod
const schema = z
  .object({
    email: z
      .string()
      .email("Invalid email address")
      .nonempty("Email is required"),
    otp: z.string().nonempty("OTP is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[a-z]/, "Password must include a lowercase letter")
      .regex(/\d/, "Password must include a number")
      .regex(/[@$!%*?&#]/, "Password must include a special character")
      .nonempty("Password is required"),
    confirmPassword: z.string().nonempty("Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"], // Path to the field to which the error applies
  });

// Type inferred from the schema
type SchemaType = z.infer<typeof schema>;

const PharmacyReset: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message state
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaType>();

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    // Clear any previous messages
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/pharmacy/password/reset",
        {
          email: data.email,
          otp: data.otp,
          password: data.password,
        }
      );

      // Handle successful response
      if (response.status === 200) {
        setSuccessMessage("Password reset successfully. Please login.");
      }
    } catch (error) {
      // Handle error response
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(
          error.response.data.message ||
            "An error occurred while resetting the password."
        );
      } else {
        setErrorMessage("An error occurred while resetting the password.");
      }
    }
  };

  return (
    <div className="vh-100 backgound">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mt-4">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">Reset Password</h2>

                {/* Error message */}
                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}

                {/* Success message */}
                {successMessage && (
                  <div className="alert alert-success" role="alert">
                    {successMessage}
                  </div>
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
                      {...register("email", {
                        required: "Email is required",
                      })}
                    />
                    {errors.email && (
                      <p className="text-danger mt-2">{errors.email.message}</p>
                    )}
                  </div>

                  {/* OTP */}
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
                    {errors.otp && (
                      <p className="text-danger mt-2">{errors.otp.message}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
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
                    {errors.password && (
                      <p className="text-danger mt-2">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <div className="input-group">
                      <input
                        type={confirmPasswordVisible ? "text" : "password"}
                        className={`form-control ${
                          errors.confirmPassword ? "is-invalid" : ""
                        }`}
                        {...register("confirmPassword", {
                          required: "Confirm password",
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
                      <p className="text-danger mt-2">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Reset Password Button */}
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                      Reset Password
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

export default PharmacyReset;
