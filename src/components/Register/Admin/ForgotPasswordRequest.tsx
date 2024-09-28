import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

// Define the validation schema using Zod
const schema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .nonempty("Email is required"),
});

type SchemaType = z.infer<typeof schema>;

const ForgotPasswordRequest: React.FC = () => {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<"success" | "danger">(
    "success"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SchemaType>();

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    try {
      // Perform manual validation with Zod schema
      schema.parse(data);

      // Make API call to send OTP
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/admin/password/forgot",
        { email: data.email }
      );

      if (response.status === 200) {
        setAlertMessage(`OTP sent successfully to: ${data.email}`);
        setAlertVariant("success");

        // Navigate to OTP page after a delay
        setTimeout(() => {
          navigate("/admin-otp");
        }, 2000);
      } else {
        setAlertMessage("Failed to send OTP. Please try again.");
        setAlertVariant("danger");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          setError(err.path[0] as keyof SchemaType, {
            type: "manual",
            message: err.message,
          });
        });
      } else if (axios.isAxiosError(error)) {
        setAlertMessage(
          "Failed to send OTP. Please check the email and try again."
        );
        setAlertVariant("danger");
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="vh-100 background">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 mt-5">
            <div className="card mt-5">
              <div className="card-body">
                <h2 className="card-title text-center">Forgot Password</h2>

                {/* Alert for success or error */}
                {alertMessage && (
                  <div className={`alert alert-${alertVariant}`} role="alert">
                    {alertMessage}
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
                      {...register("email", {
                        required: "Email is required",
                      })}
                    />
                    <div className="invalid-feedback">
                      {errors.email?.message}
                    </div>
                  </div>

                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                      Send OTP
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
