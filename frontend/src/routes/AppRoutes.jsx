import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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
import MobileMainPage from "@/pages/mobile/MobileMainPage";
import TemplatePage from "@/pages/mobile/template";
import ApprovedPage from "@/pages/mobile/mobile-approved/ApprovedPage";
import InProgressPage from "@/pages/mobile/in-progress/InProgressPage";
import ApprovedReportDetail from "@/pages/mobile/mobile-approved/ApprovedReportDetail";
import CreateMenu from "@/pages/mobile/create/CreateMenu";

// 宽度小于768时，切换到移动端路由
const switchMobileThreshold = 768;

const AppRoutes = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= switchMobileThreshold);
  const navigate = useNavigate();
  const location = useLocation();

  // auto detect mobile/pc mode
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= switchMobileThreshold;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);

        // auto redirect to the corresponding route
        const currentPath = location.pathname;
        if (currentPath.startsWith('/pc/')) {
          const mobilePath = currentPath.replace('/pc/', '/mobile/');
          navigate(mobilePath, { replace: true });
        } else if (currentPath.startsWith('/mobile/')) {
          const pcPath = currentPath.replace('/mobile/', '/pc/');
          navigate(pcPath, { replace: true });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/pc/create" replace />} />
      {/* todo actually we need a corresponding page for login and register */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* pages which have different layout for mobile and pc */}
      {/* One problem: pc path can not be visited in mobile mode. eg: visit /pc/create in mobile mode will be redirected to 404 */}
      <Route path={isMobile ? "/mobile" : "/pc"} element={isMobile ? <MobileMainPage /> : <Layout />}>
        <Route path="" element={<Navigate to={isMobile ? "/mobile/create" : "/pc/create"} replace />}></Route>
        <Route path="create" element={isMobile ? <CreateMenu /> : <AdminCreate />} />
        <Route path="template" element={<TemplatePage />} />
        <Route path="inprogress" element={isMobile ? <InProgressPage /> : <AdminInprogress />} />
        <Route path="approved" element={isMobile ? <ApprovedPage /> : <AdminApproved />} />

        {/* review center */}
        <Route path="review-form" index element={<ReviewForm />} />
        <Route path="reviewed" index element={<ReviewedList />} />
        <Route path="to-review" element={<ToReviewList />} />

        {/* interceptor */}
        <Route path="approved/:reportId" element={<ApprovedReportDetail />} />
        <Route path="approved/report/:reportId" element={<ApprovedReportDetail />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;