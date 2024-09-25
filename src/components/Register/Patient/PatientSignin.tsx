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
    .email("Please enter a valid email address")
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

const PatientSignIn: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaType>({
    // Integrate Zod validation schema with react-hook-form
    resolver: async (values) => {
      try {
        // Validate values using Zod schema
        schema.parse(values);
        return { values, errors: {} };
      } catch (err) {
        if (err instanceof z.ZodError) {
          // Return validation errors
          const fieldErrors = err.errors.reduce((acc, curr) => {
            acc[curr.path[0]] = { message: curr.message };
            return acc;
          }, {} as Record<string, { message: string }>);
          return { values: {}, errors: fieldErrors };
        }
        return { values: {}, errors: {} };
      }
    },
  });

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    try {
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/patient/login",
        {
          email: data.email, // Use email instead of SSN
          password: data.password,
        }
      );

      console.log("API Response:", response.data);

      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.token);
        setSuccessMessage(response.data.message || "Login successful.");
        setErrorMessage(null);
        navigate("/patient-home");
      } else {
        setErrorMessage(response.data.message || "Invalid email or password.");
        setSuccessMessage(null);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response);
        setErrorMessage("Incorrect email or password.");
        setSuccessMessage(null);
      } else if (error instanceof Error) {
        console.error("General Error:", error.message);
        setErrorMessage(
          error.message || "An unexpected error occurred. Please try again."
        );
        setSuccessMessage(null);
      } else {
        console.error("Unknown Error:", error);
        setErrorMessage("An unexpected error occurred. Please try again.");
        setSuccessMessage(null);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Patient Sign In</h2>
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
                    type="text"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    {...register("email")}
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
                    onClick={() => navigate("/patient-forgot")}>
                    Forgot Password?
                  </button>
                </div>

                {/* Don't have an account */}
                <div className="text-center mt-3">
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => navigate("/patient-signup")}>
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

export default PatientSignIn;
