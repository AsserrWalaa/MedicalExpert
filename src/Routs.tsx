import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Main login
import MainLogin from "./components/Register/MainLogin";
import AdminLogin from "./components/Register/AdminLogin";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./Auth";

// Admin Components
import AdminSignIn from "./components/Register/Admin/AdminSignIn";
import AdminForgot from "./components/Register/Admin/ForgotPasswordRequest";
import OTPVerification from "./components/Register/Admin/OTPVerification";
import AdminResetPassword from "./components/Register/Admin/AdminResetPassword";

// Patient Components
import PatientSignUp from "./components/Register/Patient/PatientSignup";
import PatientSignIn from "./components/Register/Patient/PatientSignin";
import ForgotPatient from "./components/Register/Patient/ForgotPatient";
import PatientOTP from "./components/Register/Patient/PatientOTP";
import PatientRegOTP from "./components/Register/Patient/PatientRegOTP";
import PatientReset from "./components/Register/Patient/PatientReset";
import PaiteintHome from "./components/Pages/PatientHome";

// Doctor Components
import DoctorSignIn from "./components/Register/Doctor/DoctorSignin";
import DoctorSignUp from "./components/Register/Doctor/DoctorSignUp";
import DoctorForgot from "./components/Register/Doctor/DoctorForgot";
// import DoctorOTP from "./components/Register/Doctor/DoctorOTP";
import DoctorReset from "./components/Register/Doctor/DoctorReset";
import DoctorRegOTP from "./components/Register/Doctor/DoctorRegOTP";

// Pharmacy Components
import PharmacySignUp from "./components/Register/Pharmacy/PharmacySignUp";
import PharmacySignIn from "./components/Register/Pharmacy/PharmacySignin";
import PharmacyForgot from "./components/Register/Pharmacy/PharmacyForgot";
// import PharmacyOTP from "./components/Register/Pharmacy/PahrmacyOTP";
import PharmacyReset from "./components/Register/Pharmacy/PharamacyReset";
import PharmacyRegOTP from "./components/Register/Pharmacy/PharmacyRegOTP";
import PharmacyForgotOTP from "./components/Register/Pharmacy/PharmacyForgotOTP";

// Lab Components
import LabSignUp from "./components/Register/Lab/LabSignup";
import LabSignin from "./components/Register/Lab/LabSignin";
import ForgotLab from "./components/Register/Lab/ForgotLab";
import LabOTP from "./components/Register/Lab/LabOTP";
import LabRegOTP from "./components/Register/Lab/LabRegOTP";
import LabReset from "./components/Register/Lab/LabReset";

// Dashboard Components
import DashboardLayout from "./components/Layout/DashboardLayout";
import Home from "./components/Pages/Home";
import Profile from "./components/Pages/Profile";
import Settings from "./components/Pages/Settings";
import Doctors from "./components/Pages/Doctors";
import Patients from "./components/Pages/Pateints";
import Labs from "./components/Pages/Labs";
import Pharmacy from "./components/Pages/Pharmacy";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Dashboard */}
          <Route
            path="/home"
            element={
              <DashboardLayout>
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              </DashboardLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <DashboardLayout>
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </DashboardLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <DashboardLayout>
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              </DashboardLayout>
            }
          />
          <Route
            path="/doctors"
            element={
              <DashboardLayout>
                <Doctors />
              </DashboardLayout>
            }
          />
          <Route
            path="/patients"
            element={
              <DashboardLayout>
                <Patients />
              </DashboardLayout>
            }
          />
          <Route
            path="/pharmacy"
            element={
              <DashboardLayout>
                <Pharmacy />
              </DashboardLayout>
            }
          />
          <Route
            path="/labs"
            element={
              <DashboardLayout>
                <Labs />
              </DashboardLayout>
            }
          />

          {/* Main login */}
          <Route path="/main-login" element={<MainLogin />} />
          <Route path="/patient-login" element={<PatientSignIn />} />
          <Route path="/admin" element={<AdminLogin />} />

          {/* Admin */}
          <Route path="/admin-signin" element={<AdminSignIn />} />
          <Route path="/admin-forgot" element={<AdminForgot />} />
          <Route path="/admin-otp" element={<OTPVerification />} />
          <Route path="/admin-reset" element={<AdminResetPassword />} />

          {/* Patient */}
          <Route path="/patient-signup" element={<PatientSignUp />} />
          <Route path="/patient-signin" element={<PatientSignIn />} />
          <Route path="/patient-forgot" element={<ForgotPatient />} />
          <Route path="/patient-forgot-otp" element={<PatientOTP />} />
          <Route path="/patient-reg-otp" element={<PatientRegOTP />} />
          <Route path="/patient-reset" element={<PatientReset />} />
          <Route path="/patient-home" element={<PaiteintHome />} />

          {/* Doctor */}
          <Route path="/doctor-signin" element={<DoctorSignIn />} />
          <Route path="/doctor-signup" element={<DoctorSignUp />} />
          <Route path="/doctor-forgot" element={<DoctorForgot />} />
          {/* <Route path="/doctor-otp" element={<DoctorOTP />} /> */}
          <Route path="/doctor-reg-otp" element={<DoctorRegOTP />} />
          <Route path="/doctor-reset" element={<DoctorReset />} />

          {/* Pharmacy */}
          <Route path="/pharmacy-signup" element={<PharmacySignUp />} />
          <Route path="/pharmacy-signin" element={<PharmacySignIn />} />
          <Route path="/pharmacy-forgot" element={<PharmacyForgot />} />
          {/* <Route path="/pharmacy-otp" element={<PharmacyOTP />} /> */}
          <Route path="/pharmacy-forgot-otp" element={<PharmacyForgotOTP />} />
          <Route path="/pharmacy-reset" element={<PharmacyReset />} />
          <Route path="/pharmacy-reg-otp" element={<PharmacyRegOTP />} />

          {/* Lab */}
          <Route path="/lab-signup" element={<LabSignUp />} />
          <Route path="/lab-signin" element={<LabSignin />} />
          <Route path="/lab-forgot" element={<ForgotLab />} />
          <Route path="/lab-forgot-otp" element={<LabOTP />} />
          <Route path="/lab-reg-otp" element={<LabRegOTP />} />
          <Route path="/lab-reset" element={<LabReset />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;
