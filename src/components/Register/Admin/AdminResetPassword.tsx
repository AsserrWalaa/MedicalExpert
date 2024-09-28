import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { CheckCircle } from "react-bootstrap-icons"; // Import the checkmark icon

const passwordSchema = z
  .object({
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must have at least one uppercase letter")
      .regex(/[a-z]/, "Password must have at least one lowercase letter")
      .regex(/\d/, "Password must have at least one number")
      .regex(/[@$!%*?&#]/, "Password must have at least one special character"),
    confirmPassword: z.string().nonempty("Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"], // This will show the error on the confirmPassword field
  });

type PasswordSchemaType = z.infer<typeof passwordSchema>;

const ResetPassword: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // State to control alert visibility

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<PasswordSchemaType>();

  const onSubmit: SubmitHandler<PasswordSchemaType> = (data) => {
    const parsed = passwordSchema.safeParse(data);

    if (!parsed.success) {
      parsed.error.errors.forEach((err) => {
        setError(err.path[0] as keyof PasswordSchemaType, {
          message: err.message,
        });
      });
      return;
    }

    // Mock password update logic
    console.log("Password updated:", parsed.data);

    // Show success alert
    setShowAlert(true);

    // Hide alert after 3 seconds
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <div className="vh-100 backgound">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 mt-5">
            <div className="card mt-5">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">Reset Password</h2>

                {showAlert && (
                  <div
                    className="alert alert-success d-flex align-items-center"
                    role="alert">
                    <CheckCircle className="me-2" /> {/* Checkmark icon */}
                    <div>Password reset successfully!</div>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      New Password
                    </label>
                    <div className="input-group">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        id="password"
                        {...register("password", {
                          required: "Password is required",
                        })}
                        className="form-control"
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="btn btn-outline-secondary">
                        {passwordVisible ? "Hide" : "Show"}
                      </button>
                    </div>
                    <p className="text-danger">{errors.password?.message}</p>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm New Password
                    </label>
                    <div className="input-group">
                      <input
                        type={confirmPasswordVisible ? "text" : "password"}
                        id="confirmPassword"
                        {...register("confirmPassword", {
                          required: "Confirm password is required",
                        })}
                        className="form-control"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmPasswordVisible(!confirmPasswordVisible)
                        }
                        className="btn btn-outline-secondary">
                        {confirmPasswordVisible ? "Hide" : "Show"}
                      </button>
                    </div>
                    <p className="text-danger">
                      {errors.confirmPassword?.message}
                    </p>
                  </div>

                  <button type="submit" className="btn btn-primary w-100">
                    Reset Password
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
