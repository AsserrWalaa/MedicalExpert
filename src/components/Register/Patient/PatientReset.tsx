import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../index.css";

// Zod schema for form validation
const schema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must be numeric"),
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

type SchemaType = z.infer<typeof schema>;

const DoctorReset: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email; // Access email from location state

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SchemaType>();

  // State for individual OTP inputs
  const [otp, setOtp] = useState(Array(6).fill(""));

  const handleOtpChange = (index: number, value: string) => {
    // Update OTP value in the array
    const newOtp = [...otp];
    newOtp[index] = value;

    // Move to the next input field if length is 1
    if (value.length === 1 && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    // Move to the previous input field if backspacing
    if (value.length === 0 && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }

    setOtp(newOtp);
    // Update form value for validation
    setValue("otp", newOtp.join(""));
  };

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    if (data.password !== data.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    setLoading(true);

    const apiData = {
      email: email, // Use the email from route state
      otp: data.otp,
      password: data.password,
    };

    try {
      // Perform the API call to reset the password
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/patient/password/reset",
        apiData
      );

      console.log("Response data:", response.data);

      // Show success message and reset form
      setSuccessMessage("Password reset successful!");
      setErrorMessage(null);
      setPasswordsMatch(true);
      setLoading(false);

      // Redirect after a delay
      setTimeout(() => {
        navigate("/patient-signin");
      }, 2000);
    } catch (error) {
      setErrorMessage("Failed to reset password. Please try again.");
      setSuccessMessage(null);
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 user-backgrond">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mt-4 user-form ">
              <div className="card-body ">
                <h2 className="card-title text-center">Reset Password</h2>

                {/* Success Alert */}
                {successMessage && (
                  <div className="alert alert-success text-center" role="alert">
                    {successMessage}
                  </div>
                )}

                {/* Error Alert */}
                {errorMessage && (
                  <div className="alert alert-danger text-center" role="alert">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Hidden Email Input */}
                  <input type="hidden" value={email} />
                  <div className="mb-3">
                    <label className="form-label">OTP</label>
                    <div className="d-flex justify-content-between">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength={1}
                          className={`form-control mx-1 border-primary fw-bold text-primary text-center ${
                            errors.otp ? "is-invalid" : ""
                          }`}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(
                              index,
                              e.target.value.replace(/\D/g, "")
                            )
                          }
                        />
                      ))}
                    </div>
                    <div className="invalid-feedback">
                      {errors.otp?.message}
                    </div>
                  </div>

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
                        onClick={() =>
                          setPasswordVisible((prevState) => !prevState)
                        }>
                        {passwordVisible ? "Hide" : "Show"}
                      </button>
                      <div className="invalid-feedback">
                        {errors.password?.message}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <div className="input-group">
                      <input
                        type={confirmPasswordVisible ? "text" : "password"}
                        className={`form-control ${
                          !passwordsMatch || errors.confirmPassword
                            ? "is-invalid"
                            : ""
                        }`}
                        {...register("confirmPassword", {
                          required: "Confirm password is required",
                        })}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setConfirmPasswordVisible((prevState) => !prevState)
                        }>
                        {confirmPasswordVisible ? "Hide" : "Show"}
                      </button>
                      <div className="invalid-feedback">
                        {errors.confirmPassword?.message}
                        {!passwordsMatch && <div>Passwords do not match.</div>}
                      </div>
                    </div>
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}>
                      {loading ? "Resetting Password..." : "Reset Password"}
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

export default DoctorReset;
