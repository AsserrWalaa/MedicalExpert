import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

const schema = z.object({
  email: z.string().email("Invalid email format").nonempty("Email is required"),
  otp: z.string().nonempty("OTP is required"),
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
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalVariant, setModalVariant] = useState<"success" | "danger">(
    "success"
  );

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaType>();

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    if (data.password !== data.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    setLoading(true);

    const apiData = {
      email: data.email,
      otp: data.otp,
      password: data.password,
    };

    try {
      // Perform the API call to reset the password
      const response = await axios.post(
        "https://admin.medicalexpertise.net/api/doctor/password/reset",
        apiData
      );

      // Optionally log the response for debugging
      console.log("Response data:", response.data);

      setModalTitle("Success");
      setModalMessage("Password reset successful!");
      setModalVariant("success");
      setShowModal(true);
      navigate("/doctor-signin");
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("Failed to reset password. Please try again.");
      setModalVariant("danger");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center">Reset Password</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    {...register("email")}
                  />
                  <div className="invalid-feedback">
                    {errors.email?.message}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">OTP</label>
                  <input
                    type="text"
                    className={`form-control ${errors.otp ? "is-invalid" : ""}`}
                    {...register("otp")}
                  />
                  <div className="invalid-feedback">{errors.otp?.message}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label">New Password</label>
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
                  <div className="invalid-feedback">
                    {errors.confirmPassword?.message}
                  </div>
                  {!passwordsMatch && (
                    <div className="text-danger">Passwords must match</div>
                  )}
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

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className={
            modalVariant === "danger" ? "text-danger" : "text-success"
          }>
          {modalMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DoctorReset;
