import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../index.css";

// Define the validation schema using Zod
const schema = z.object({
  pharmacyName: z
    .string()
    .min(4, "Pharmacy name must be at least 4 characters")
    .max(30, "Pharmacy name must be at most 30 characters")
    .nonempty("Pharmacy name is required"),
  email: z
    .string()
    .email("Please enter a valid email")
    .nonempty("Email is required"),
  pharmacyId: z
    .string()
    .regex(/^\d+$/, "Pharmacy ID must be numeric")
    .nonempty("Pharmacy ID is required"),
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

const PharmacySignUp: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
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
        "https://admin.medicalexpertise.net/api/pharmacy/register",
        {
          name: data.pharmacyName,
          email: data.email,
          password: data.password,
          password_confirmation: data.confirmPassword,
          pharmacy_id: data.pharmacyId,
        }
      );

      if (response.data.status === "success") {
        alert(response.data.message); // Show success message
        navigate(`/pharmacy-reg-otp?email=${encodeURIComponent(data.email)}`); // Pass email to OTP verification page
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-100 backgound">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mt-4">
              <div className="card-body">
                <h2 className="card-title text-center">Pharmacy Sign Up</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Pharmacy Name */}
                  <div className="mb-3">
                    <label className="form-label">Pharmacy Name</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.pharmacyName ? "is-invalid" : ""
                      }`}
                      {...register("pharmacyName", {
                        required: "Pharmacy name is required",
                      })}
                      disabled={loading}
                    />
                    <div className="invalid-feedback">
                      {errors.pharmacyName?.message}
                    </div>
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
                      disabled={loading}
                    />
                    <div className="invalid-feedback">
                      {errors.email?.message}
                    </div>
                  </div>

                  {/* Pharmacy ID */}
                  <div className="mb-3">
                    <label className="form-label">Pharmacy ID</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.pharmacyId ? "is-invalid" : ""
                      }`}
                      {...register("pharmacyId", {
                        required: "ID is required",
                      })}
                      disabled={loading}
                    />
                    <div className="invalid-feedback">
                      {errors.pharmacyId?.message}
                    </div>
                  </div>

                  {/* New Password */}
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

                  {/* Sign Up Button */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}>
                      {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                  </div>
                  {/* Don't have an account */}
                  <div className="text-center mt-3">
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={() => navigate("/pharmacy-signin")}>
                      Already have an account? Signin
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

export default PharmacySignUp;
