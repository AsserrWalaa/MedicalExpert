import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import "bootstrap/dist/css/bootstrap.min.css";

// Define the validation schema using Zod
const schema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/\d/, "Password must include a number")
    .regex(/[@$!%*?&#]/, "Password must include a special character")
    .nonempty("Password is required"),
  confirmPassword: z.string().nonempty("Confirm password is required"),
});

// Type inferred from the schema
type SchemaType = z.infer<typeof schema>;

const PasswordResetComponent: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SchemaType>();

  const onSubmit: SubmitHandler<SchemaType> = (data) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords must match",
      });
      return;
    }

    // Simulate password reset logic here
    // For demonstration purposes, let's assume the reset was successful
    const isSuccess = true; // Replace this with actual success condition

    if (isSuccess) {
      setSuccessMessage("Password has been reset successfully.");
      setErrorMessage(null); // Clear any previous error message
    } else {
      setErrorMessage("Failed to reset the password. Please try again.");
      setSuccessMessage(null); // Clear any previous success message
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Reset Password</h2>

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

              <form onSubmit={handleSubmit(onSubmit)}>
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
                      {...register("confirmPassword")}
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
  );
};

export default PasswordResetComponent;
