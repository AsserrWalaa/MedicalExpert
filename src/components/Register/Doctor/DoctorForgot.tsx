import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../index.css";

// Define the validation schema using Zod
const schema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .nonempty("Email is required"),
});

type SchemaType = z.infer<typeof schema>;

const ForgotPasswordRequest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SchemaType>({
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    setLoading(true);
    setMessage(null);

    if (!otpSent) {
      // Send OTP logic
      try {
        const response = await axios.post(
          "https://admin.medicalexpertise.net/api/doctor/password/forgot",
          { email: data.email }
        );
        console.log("OTP sent successfully:", response.data);
        setOtpSent(true);
        setMessage("OTP sent successfully! Please check your email.");
        setMessageType("success");
      } catch (error) {
        console.error("Error sending OTP:", error);
        if (axios.isAxiosError(error)) {
          // Check for status code 500
          if (error.response?.status === 500) {
            const errorMsg = "Email is not verified. Please check your email.";
            setError("email", { type: "manual", message: errorMsg });
            setMessage(errorMsg);
            setMessageType("error");
          } else {
            const errorMsg =
              error.response?.data?.message ||
              "Failed to send OTP. Please try again.";
            setError("email", { type: "manual", message: errorMsg });
            setMessage(errorMsg);
            setMessageType("error");
          }
        }
      } finally {
        setLoading(false);
      }
    } else {
      // After OTP is sent, navigate to DoctorReset page with email passed as state
      try {
        navigate("/doctor-reset", { state: { email: data.email } });
      } catch (error) {
        console.error("Error navigating to reset password:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="vh-100 backgound">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 mt-5">
            <div className="card mt-5">
              <div className="card-body">
                <h2 className="card-title text-center">Forgot Password</h2>

                {/* Display Success/Error message */}
                {message && (
                  <div
                    className={`alert ${
                      messageType === "success"
                        ? "alert-success"
                        : "alert-danger"
                    }`}
                    role="alert">
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      {...register("email", { required: "Email is required" })}
                      readOnly={otpSent}
                    />
                    <div className="invalid-feedback">
                      {errors.email?.message}
                    </div>
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}>
                      {loading
                        ? otpSent
                          ? "Verifying OTP..."
                          : "Sending OTP..."
                        : otpSent
                        ? "Verify OTP"
                        : "Send OTP"}
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

export default ForgotPasswordRequest;
