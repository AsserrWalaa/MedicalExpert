import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../../assets/imgs/new logo.webp";
import "../../index.css";

// Define the validation schema using Zod
const schema = z
  .object({
    patientName: z
      .string()
      .min(4, "Patient Name must be at least 4 characters")
      .max(30, "Patient Name must be at most 30 characters")
      .nonempty("Patient Name is required"),
    email: z
      .string()
      .email("Please enter a valid email")
      .nonempty("Email is required"),
    SSN: z
      .string()
      .regex(/^\d+$/, "ID must contain only digits")
      .nonempty("ID is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must have at least one uppercase letter")
      .regex(/[a-z]/, "Password must have at least one lowercase letter")
      .regex(/\d/, "Password must have at least one number")
      .regex(/[@$!%*?&#]/, "Password must have at least one special character")
      .nonempty("Password is required"),
    confirmPassword: z.string().nonempty("Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

// Type inferred from the schema
type SchemaType = z.infer<typeof schema>;

const PatientSignUp: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SchemaType>();

  const validateForm = (data: SchemaType) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        setError(issue.path[0] as keyof SchemaType, {
          type: "manual",
          message: issue.message,
        });
      });
      return false;
    }
    return true;
  };

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    setFormError("");

    if (!validateForm(data)) {
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
        navigate(`/patient-reg-otp?email=${encodeURIComponent(data.email)}`); // Pass email as a query parameter
      } else {
        setFormError("Registration failed. Please try again.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
        setFormError(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
      } else {
        console.error("Error:", error);
        setFormError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-100 background">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mt-4">
              <div className="card-body">
                <h2 className="card-title text-center">Patient SignUp</h2>

                <img
                  src={logo}
                  className="d-block my-3 mx-auto"
                  alt="Hero"
                  height={180}
                  width={200}
                />

                {formError && (
                  <div className="alert alert-danger" role="alert">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Patient Name Input */}
                  <div className="mb-3">
                    <label className="form-label">Patient Name</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.patientName ? "is-invalid" : ""
                      }`}
                      {...register("patientName")}
                    />
                    {errors.patientName && (
                      <p className="text-danger">
                        {errors.patientName.message}
                      </p>
                    )}
                  </div>

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
                    {errors.email && (
                      <p className="text-danger">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Patient ID Input */}
                  <div className="mb-3">
                    <label className="form-label">National ID</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.SSN ? "is-invalid" : ""
                      }`}
                      {...register("SSN")}
                    />
                    {errors.SSN && (
                      <p className="text-danger">{errors.SSN.message}</p>
                    )}
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
                    {errors.password && (
                      <p className="text-danger">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Confirm Password Input */}
                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
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
