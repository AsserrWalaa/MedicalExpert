import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../../assets/imgs/new logo.webp";

import "../../index.css";

// Define the validation schema using Zod
const schema = z.object({
  patientName: z
    .string()
    .min(4, "patientName must be at least 4 characters")
    .max(30, "patientName must be at most 30 characters")
    .nonempty("patientName is required"),
  email: z
    .string()
    .email("Please enter a valid email")
    .nonempty("Email is required"),
  SSN: z
    .string()
    .regex(/^\d+$/, "Please enter a valid patient ID")
    .nonempty("patientId is required"),
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

const PatientSignUp: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
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
    try {
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/patient/register",
        {
          name: data.patientName,
          email: data.email,
          password: data.password,
          password_confirmation: data.confirmPassword,
          SSN: data.SSN,
        }
      );

      if (response.data.status === "success") {
        setMessage("Registration successful. Please complete registration.");
        setIsSuccess(true);
        setTimeout(() => {
          navigate(`/patient-reg-otp?email=${data.email}`); // Pass email to OTP verification
        }, 2000);
      } else {
        setMessage(
          response.data.message || "Registration failed. Please try again."
        );
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Response data:", error.response.data);
        setMessage(
          error.response.data.message ||
            "Registration failed. Please try again."
        );
      } else {
        setMessage("Registration failed. Please try again.");
      }
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-100 user-backgrond">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mt-4 user-form ">
              <div className="card-body ">
                <h2 className="card-title text-center">Patient SignUp</h2>
                <img
                  src={logo}
                  className="d-block my-3 mx-auto"
                  alt="Hero"
                  height={180}
                  width={200}
                />
                {message && (
                  <div
                    className={`alert ${
                      isSuccess ? "alert-success" : "alert-danger"
                    }`}
                    role="alert">
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label className="form-label">Patient Name</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.patientName ? "is-invalid" : ""
                      }`}
                      {...register("patientName", {
                        required: "Name is required",
                      })}
                    />
                    {errors.patientName && (
                      <p className="text-danger">
                        {errors.patientName.message}
                      </p>
                    )}
                  </div>

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
                      <p className="text-danger">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Patient ID</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.SSN ? "is-invalid" : ""
                      }`}
                      {...register("SSN", {
                        required: "ID is required",
                      })}
                    />
                    {errors.SSN && (
                      <p className="text-danger">{errors.SSN.message}</p>
                    )}
                  </div>

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
                            "the password must contain an uppercase letter , lowercase letter , symbols , and numbers ",
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

                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
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
                      <p className="text-danger">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}>
                      {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                  </div>

                  <div className="text-center mt-3">
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={() => navigate("/patient-signin")}>
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

export default PatientSignUp;
