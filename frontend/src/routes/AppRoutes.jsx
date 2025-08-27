import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import CreateForm from "@/pages/createForm";
import CreateTemplate from "@/pages/createTemplate";
import FormList from "@/pages/formList";
import NotFound from "@/pages/404";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Routes requiring primary role */}
      <Route
        path="/create-form"
        element={
          <PrivateRoute requiredRole="primary">
            <CreateForm />
          </PrivateRoute>
        }
      />

      {/* Routes requiring admin role */}
      <Route
        path="/create-template"
        element={
          <PrivateRoute requiredRole="admin">
            <CreateTemplate />
          </PrivateRoute>
        }
      />

       {/* Routes requiring authentication */}
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
