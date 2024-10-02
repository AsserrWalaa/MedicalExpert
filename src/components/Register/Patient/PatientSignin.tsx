import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../../assets/imgs/new logo.webp";

// Define the validation schema using Zod
const schema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

// Type inferred from the schema
type SchemaType = z.infer<typeof schema>;

const PatientSignIn: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaType>({
    resolver: async (values) => {
      try {
        schema.parse(values);
        return { values, errors: {} };
      } catch (err) {
        if (err instanceof z.ZodError) {
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
    setLoading(true); // Set loading to true
    try {
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/patient/login",
        {
          email: data.email,
          password: data.password,
        }
      );

      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.token);
        setSuccessMessage(response.data.message || "Login successful.");
        setErrorMessage(null);
        navigate("/patient-home");
      } else {
        setErrorMessage(response.data.message || "Invalid email or password.");
        setSuccessMessage(null);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      setSuccessMessage(null);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="vh-100 user-backgrond">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mt-4 user-form">
              <div className="card-body">
                <h2 className="card-title text-center">Patient SignUp</h2>

                {/* Adjust logo size here */}
                <img
                  src={logo}
                  className="d-block my-3 mx-auto"
                  alt="Hero"
                  height={180}
                  width={200}
                />

                {errorMessage && (
                  <div
                    className="alert alert-danger"
                    role="alert"
                    aria-live="assertive">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div
                    className="alert alert-success"
                    role="alert"
                    aria-live="assertive">
                    {successMessage}
                  </div>
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

                  {/* Sign In Button */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}>
                      {loading ? "Signing In..." : "Sign In"}
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
    </div>
  );
};

export default PatientSignIn;
