import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import CreateForm from "@/pages/createForm";
import CreateTemplate from "@/pages/createTemplate";
import FormList from "@/pages/FormList";
import SsoLogin from "@/pages/ssoLogin";
import NotFound from "@/pages/404";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/sso-login" element={<SsoLogin />} />

      {/* 需要primary权限的路由 */}
      <Route
        path="/create-form"
        element={
          <PrivateRoute requiredRole="primary">
            <CreateForm />
          </PrivateRoute>
        }
      />

      {/* 需要admin权限的路由 */}
      <Route
        path="/create-template"
        element={
          <PrivateRoute requiredRole="admin">
            <CreateTemplate />
          </PrivateRoute>
        }
      />

       {/* 需要登录的路由 */}
       <Route 
        path="/form-list" 
        element={
          <PrivateRoute>
            <FormList />
          </PrivateRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
export default AppRoutes;
