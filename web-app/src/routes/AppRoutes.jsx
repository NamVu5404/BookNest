import { BrowserRouter as Router, Navigate, Route, Routes, } from "react-router-dom";
import Authenticate from "../pages/home/Authenticate";
import Home from "../pages/home/Home";
import Login from "../pages/home/Login";
import Register from "../pages/home/Register";
import ResetPassword from "../pages/home/ResetPassword";
import VerifyEmail from "../pages/home/VerifyEmail";
import VerifyResetPassword from "../pages/home/VerifyResetPassword";
import ConfirmEmail from "../pages/home/ConfirmEmail";
import NotFound from "../pages/home/404NotFound";
import AppLayout from "../layout/AppLayout";
import { useAuth } from "../contexts/AuthProvider";
import { Spin } from "antd";
import { isAuthenticated } from "../services/authenticationService";
import MyProfile from "../pages/home/MyProfile";
import Profile from "../pages/home/Profile";
import ScrollRestoration from "../components/ScrollRestoration";
import Settings from "../pages/home/Settings";

// Component bảo vệ route yêu cầu xác thực
const ProtectedRoute = ({ children }) => {
  const { loading } = useAuth();

  if (loading) return <Spin size="large" />;

  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Router>
      <ScrollRestoration />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/authenticate" element={<Authenticate />} />

          {/* private route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MyProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />{" "}
        <Route path="/password/reset" element={<ConfirmEmail />} />
        <Route
          path="/verify-reset-password"
          element={<VerifyResetPassword />}
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
