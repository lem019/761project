import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import CreateForm from "@/pages/createForm";
import CreateTemplate from "@/pages/createTemplate";
import ReviewForm from "@/pages/reviewForm";
import FormList from "@/pages/formList";
import AdminCreate from "@/pages/adminCreate";
import AdminInprogress from "@/pages/adminInprogress";
import AdminApproved from "@/pages/adminApproved";
import ToReviewList from "@/pages/toReviewList";
import ReviewedList from "@/pages/reviewedList";
import NotFound from "@/pages/404";
import Layout from "@/components/layout/index";
import PrivateRoute from "./PrivateRoute";
import MobileMainPage from "@/pages/mobile/MobileMainPage";
import TemplatePage from "@/pages/mobile/Template";
import ApprovedPage from "@/pages/mobile/mobile-approved/ApprovedPage";


// 👇 新增：引入你刚建的两个页面
import InProgressPage from "@/pages/mobile/in-progress/InProgressPage";
import ApprovedReportDetail from "@/pages/mobile/mobile-approved/ApprovedReportDetail";
import MobileCreateFormPage from "@/pages/mobile/create/MobileCreateFormPage";
import CreateMenu from "@/pages/mobile/create/CreateMenu";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin-create" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/admin-create" element={<Layout />}>
        <Route index element={<AdminCreate />} />
      </Route>
      <Route path="/admin-in-progress" element={<Layout />}>
        <Route index element={<AdminInprogress />} />
      </Route>
      <Route path="/admin-approved" element={<Layout />}>
        <Route index element={<AdminApproved />} />
      </Route>

      {/* Review Center routes */}
      <Route path="/to-review" element={<Layout />}>
        <Route index element={<ToReviewList />} />
      </Route>
      <Route path="/reviewed" element={<Layout />}>
        <Route index element={<ReviewedList />} />
      </Route>

      {/* 简化路由配置进行测试 */}
      <Route path="/toreview-form" element={<Layout />}>
        <Route index element={<CreateForm />} />
      </Route>
      <Route path="/review-form" element={<Layout />}>
        <Route index element={<ReviewForm />} />
      </Route>

      <Route path="/pending-approval" element={<Layout />}>
        <Route
          index
          element={
            <div style={{ padding: "24px", background: "#fff", borderRadius: "8px" }}>
              <h2>Pending Approval</h2>
              <p>This page shows pending approval items.</p>
            </div>
          }
        />
      </Route>

      <Route path="/approved" element={<Layout />}>
        <Route
          index
          element={
            <div style={{ padding: "24px", background: "#fff", borderRadius: "8px" }}>
              <h2>Approved</h2>
              <p>This page shows approved items.</p>
            </div>
          }
        />
      </Route>

      <Route path="/rejected" element={<Layout />}>
        <Route
          index
          element={
            <div style={{ padding: "24px", background: "#fff", borderRadius: "8px" }}>
              <h2>Rejected</h2>
              <p>This page shows rejected items.</p>
            </div>
          }
        />
      </Route>

      {/* ===== Mobile 路由 =====
          注意：MobileMainPage 里需要有 <Outlet/> 才能渲染子路由 */}
      <Route path="/mobile" element={<MobileMainPage />}>
        <Route path="approved" element={<ApprovedPage />} />
        <Route path="approved/:reportId" element={<ApprovedReportDetail />} />
        <Route path="approved/report/:reportId" element={<ApprovedReportDetail />} />

        <Route path="inprogress" element={<InProgressPage />} />
        <Route path="inprogress/:id" element={<div>TODO: Edit Form Page</div>} />

        <Route path="create" element={<CreateMenu />} />
        <Route path="create/new" element={<MobileCreateFormPage />} />
        <Route path="template" element={<TemplatePage />} />
      </Route>

      {/* 仅管理员 */}
      <Route
        path="/create-template"
        element={
          <PrivateRoute requiredRole="admin">
            <CreateTemplate />
          </PrivateRoute>
        }
      />

      {/* Routes requiring admin role */}
      <Route
        path="/review-form"
        element={
          <PrivateRoute requiredRole="admin">
            <ReviewForm />
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