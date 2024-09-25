import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

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
  const [showModal, setShowModal] = useState(false);
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
      // Send the data with the specified API format
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/lab/register",
        {
          name: data.laboratoryName, // Matches key "name"
          email: data.email, // Matches key "email"
          password: data.password, // Matches key "password"
          password_confirmation: data.confirmPassword, // Matches key "password_confirmation"
          lab_id: data.laboratoryId, // Matches key "lab_id"
        }
      );

      if (response.data.status === "success") {
        setModalMessage(
          "Registration successful! Please check your email for OTP verification."
        );
        navigate("/lab-reg-otp"); // Redirect after 2 seconds
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
        setModalMessage(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
      } else {
        console.error("Error:", error);
        setModalMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Laboratory Sign Up</h2>
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
                      required: "Name is required",
                    })}
                  />
                  <p className="text-danger">
                    {errors.laboratoryName?.message}
                  </p>
                </div>

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
                  <p className="text-danger">{errors.email?.message}</p>
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
                      required: "ID is required",
                    })}
                  />
                  <p className="text-danger">{errors.laboratoryId?.message}</p>
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
                  <p className="text-danger">{errors.password?.message}</p>
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
                        required: "Must confirm password",
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
                  <p className="text-danger">
                    {errors.confirmPassword?.message}
                  </p>
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

      {/* Modal for displaying messages */}
      <div
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Status</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>{modalMessage}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}>
                Close
              </button>
              {modalMessage === "Registration successful!" && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate("/lab-reg-otp")}>
                  Go to OTP Verification
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaboratorySignUp;