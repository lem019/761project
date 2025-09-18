import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import ReviewForm from "@/pages/pc/reviewForm";
import AdminCreate from "@/pages/pc/adminCreate";
import AdminInprogress from "@/pages/pc/adminInprogress";
import AdminApproved from "@/pages/pc/adminApproved";
import ToReviewList from "@/pages/pc/toReviewList";
import ReviewedList from "@/pages/pc/reviewedList";
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
      <Route path="/" element={<Navigate to="/pc/admin-create" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* PC Admin routes */}
      <Route path="/pc" element={<Layout />}>
        <Route path="admin-create" index element={<AdminCreate />} />
        <Route path="admin-in-progress" index element={<AdminInprogress />} />
        <Route path="admin-approved" index element={<AdminApproved />} />
        <Route path="review-form" index element={<ReviewForm />} />
        <Route path="reviewed" index element={<ReviewedList />} />
        <Route path="to-review"  element={<ToReviewList />} />
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

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;