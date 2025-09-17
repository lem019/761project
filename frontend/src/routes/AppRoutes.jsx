import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import CreateForm from "@/pages/createForm";
import CreateTemplate from "@/pages/createTemplate";
import FormList from "@/pages/formList";
import NotFound from "@/pages/404";
import Layout from "@/components/layout/index";
import PrivateRoute from "./PrivateRoute";
import MobileMainPage from "@/pages/mobile/MobileMainPage";
import ApprovedPage from "@/pages/mobile/mobile-approved/ApprovedPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/create-form" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 简化路由配置进行测试 */}
      <Route path="/create-form" element={<Layout />}>
        <Route index element={<CreateForm />} />
      </Route>

      <Route path="/pending-approval" element={<Layout />}>
        <Route index element={
          <div style={{ padding: '24px', background: '#fff', borderRadius: '8px' }}>
            <h2>Pending Approval</h2>
            <p>This page shows pending approval items.</p>
          </div>
        } />
      </Route>

      <Route path="/approved" element={<Layout />}>
        <Route index element={
          <div style={{ padding: '24px', background: '#fff', borderRadius: '8px' }}>
            <h2>Approved</h2>
            <p>This page shows approved items.</p>
          </div>
        } />
      </Route>

      <Route path="/rejected" element={<Layout />}>
        <Route index element={
          <div style={{ padding: '24px', background: '#fff', borderRadius: '8px' }}>
            <h2>Rejected</h2>
            <p>This page shows rejected items.</p>
          </div>
        } />
      </Route>

      {/* Routes for mobile */}
      <Route path="/mobile" element={<MobileMainPage />}>
        <Route path="approved" element={<ApprovedPage />} />
        <Route path="create" element={<div>Create Page</div>} />
        <Route path="inprogress" element={<div>In Progress Page</div>} />
        <Route path="report/:reportId" element={<div>Report Detail Page</div>} />
      </Route>

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