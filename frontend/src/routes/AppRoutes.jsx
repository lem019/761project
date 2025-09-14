import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import CreateForm from "@/pages/createForm";
import CreateTemplate from "@/pages/createTemplate";
import FormList from "@/pages/formList";
import NotFound from "@/pages/404";
import Layout from "@/components/layout/index";
import PrivateRoute from "./PrivateRoute";

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


// import { Routes, Route, Navigate } from "react-router-dom";
// import LoginPage from "@/pages/login";
// import RegisterPage from "@/pages/register";
// import NotFound from "@/pages/404";
// import Layout from "@/components/layout/index";
// import PrivateRoute from "./PrivateRoute";

// // Admin pages
// import AdminToReviewPage from "@/pages/admin/ToReviewPage";
// import AdminApprovedPage from "@/pages/admin/ApprovedPage";
// import AdminRejectedPage from "@/pages/admin/RejectedPage";
// import ReviewDetailPage from "@/pages/admin/ReviewDetailPage";

// // Employee pages
// import EmployeeCreatePage from "@/pages/employee/CreatePage";
// import EmployeePendingPage from "@/pages/employee/PendingPage";
// import EmployeeApprovedPage from "@/pages/employee/ApprovedPage";
// import EmployeeRejectedPage from "@/pages/employee/RejectedPage";

// // 其他旧页面（如仍要保留）
// import CreateTemplate from "@/pages/createTemplate";
// import FormList from "@/pages/formList";
// import CreateForm from "@/pages/createForm"; // 若是老页面，可先保留

// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<Navigate to="/login" replace />} />
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/register" element={<RegisterPage />} />

//       {/* Admin 区（需要 admin 权限） */}
//       <Route element={<PrivateRoute requiredRole="admin" />}>
//         <Route element={<Layout />}>
//           <Route path="/admin/toreview" element={<AdminToReviewPage />} />
//           <Route path="/admin/approved" element={<AdminApprovedPage />} />
//           <Route path="/admin/rejected" element={<AdminRejectedPage />} />
//           <Route path="/admin/review/:id" element={<ReviewDetailPage />} />
//         </Route>
//       </Route>

//       {/* Employee 区（需要 primary 权限） */}
//       <Route element={<PrivateRoute requiredRole="primary" />}>
//         <Route element={<Layout />}>
//           <Route path="/employee/create" element={<EmployeeCreatePage />} />
//           <Route path="/employee/pending" element={<EmployeePendingPage />} />
//           <Route path="/employee/approved" element={<EmployeeApprovedPage />} />
//           <Route path="/employee/rejected" element={<EmployeeRejectedPage />} />
//         </Route>
//       </Route>

//       {/* 旧页面（如仍需要） */}
//       <Route element={<PrivateRoute requiredRole="admin" />}>
//         <Route path="/create-template" element={<CreateTemplate />} />
//       </Route>
//       <Route element={<PrivateRoute />}>
//         <Route path="/form-list" element={<FormList />} />
//         {/* 如果你还要保留最初的 create-form 演示页： */}
//         <Route path="/create-form" element={<CreateForm />} />
//       </Route>

//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// };
// export default AppRoutes;


// import { Routes, Route, Navigate } from "react-router-dom";
// import LoginPage from "@/pages/login";
// import RegisterPage from "@/pages/register";
// import NotFound from "@/pages/404";
// import Layout from "@/components/layout/index";
// import PrivateRoute from "./PrivateRoute";

// // Admin pages
// import AdminToReviewPage from "@/pages/admin/ToReviewPage";
// import AdminPendingPage from "@/pages/admin/PendingPage";
// import AdminApprovedPage from "@/pages/admin/ApprovedPage";
// import AdminRejectedPage from "@/pages/admin/RejectedPage";
// import ReviewDetailPage from "@/pages/admin/ReviewDetailPage";

// // Employee pages
// import EmployeeCreatePage from "@/pages/employee/CreatePage";
// import EmployeePendingPage from "@/pages/employee/PendingPage";
// import EmployeeApprovedPage from "@/pages/employee/ApprovedPage";
// import EmployeeRejectedPage from "@/pages/employee/RejectedPage";
// import FormEditPage from "@/pages/employee/FormEditPage";

// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<Navigate to="/login" replace />} />
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/register" element={<RegisterPage />} />

//       {/* Admin 区 */}
//       <Route element={<PrivateRoute requiredRole="admin" />}>
//         <Route element={<Layout />}>
//           <Route path="/admin/toreview" element={<AdminToReviewPage />} />
//           <Route path="/admin/pending" element={<AdminPendingPage />} />
//           <Route path="/admin/approved" element={<AdminApprovedPage />} />
//           <Route path="/admin/rejected" element={<AdminRejectedPage />} />
//           <Route path="/admin/review/:id" element={<ReviewDetailPage />} />
//         </Route>
//       </Route>

//       {/* Employee 区 */}
//       <Route element={<PrivateRoute requiredRole="primary" />}>
//         <Route element={<Layout />}>
//           <Route path="/employee/create" element={<EmployeeCreatePage />} />
//           <Route path="/employee/pending" element={<EmployeePendingPage />} />
//           <Route path="/employee/approved" element={<EmployeeApprovedPage />} />
//           <Route path="/employee/rejected" element={<EmployeeRejectedPage />} />
//           <Route path="/employee/form/:id" element={<FormEditPage />} />
//         </Route>
//       </Route>

//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// };

// export default AppRoutes;

