import { Skeleton, Spin } from "antd";
import { Suspense, lazy } from "react";
import { matchPath, useLocation, useRoutes } from "react-router-dom";
import ForgotForm from "../components/auth/ForgotForm";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import PageWithTitle from "../components/shared/PageWithTitle"; // Import component wrapper
import PrivateRoute from "../components/shared/PrivateRoute";
import ScheduleList from "../pages/schedule";
import Settings from "../components/users/Settings";
import CoursesFamilyPage from "../pages/courses/coursefamily";
import AttendancePage from "../pages/attendance";
import ModulePage from "../pages/module";
import BuildingPage from "../pages/building";
import CoursePage from "../pages/courses/course";
import ClassroomPage from "../pages/classroom";

// Loading Components
const LoadingIndicator = () => (
  <div className="flex justify-center items-center h-screen text-center">
    <div className="flex flex-col items-center space-y-4">
      <Spin size="large" />
      <p className="text-lg font-medium text-gray-700">
        Loading
        <span className="relative">
          <span className=" animate-dots-blinking">.</span>
          <span className=" animate-dots-blinking animation-delay-200">.</span>
          <span className=" animate-dots-blinking animation-delay-400">.</span>
        </span>
      </p>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="flex justify-center items-center h-screen text-center">
    <Skeleton active />
  </div>
);

// Lazy load các trang
const AuthPage = lazy(() => import("../pages/auth"));
const DashBoardPage = lazy(() => import("../pages/dashboard"));
const ErrorPage = lazy(() => import("../pages/errors"));
const ClassPage = lazy(() => import("../pages/classes"));
const MainPage = lazy(() => import("../pages"));
const StudentPage = lazy(() => import("../pages/student"));
const TeacherPage = lazy(() => import("../pages/teacher"));
const UserPage = lazy(() => import("../pages/users"));
const FreshmenPageList = lazy(() => import("../pages/freshmen"));
const PromotionPage = lazy(() => import("../pages/promotions"));
const AdmissionPage = lazy(() => import("../pages/admission"));
const AddApplicationForm = lazy(
  () => import("../components/application/AddApplicationForm"),
);
const ApplicationDocumentPage = lazy(
  () => import("../pages/applicationdocument"),
);
const AdmissionDetail = lazy(() => import("../pages/admission/detail"));
const getTitleFromLocation = (pathname: string) => {
  if (
    matchPath({ path: "/student-list/class/:classId", end: false }, pathname)
  ) {
    return "Quản lý học sinh";
  }
  switch (pathname) {
    case "/auth/login":
      return "Đăng nhập";
    case "/auth/signup":
      return "Đăng kí";
    case "/":
      return "Trang Chính";
    case "/about":
      return "Giới Thiệu";
    case "/users":
      return "Quản lý người dùng";
    case "/students":
      return "Quản lý học sinh";
    case "/teachers":
      return "Quản lý giáo viên";
    case "/classes":
      return "Quản lý lớp học";
    case "/building":
      return "Quản lý toà nhà";
    default:
      return "404 - Không Tìm Thấy Trang";
  }
};

function MainRoutes() {
  const location = useLocation();
  const title = getTitleFromLocation(location.pathname);

  const routes = useRoutes([
    {
      path: "/auth",
      element: (
        <PageWithTitle title={title}>
          <Suspense fallback={<LoadingIndicator />}>
            <AuthPage />
          </Suspense>
        </PageWithTitle>
      ),
      children: [
        {
          path: "login",
          element: (
            <PageWithTitle title={title}>
              <Suspense fallback={<LoadingSkeleton />}>
                <LoginForm />
              </Suspense>
            </PageWithTitle>
          ),
        },
        {
          path: "signup",
          element: (
            <PageWithTitle title={title}>
              <Suspense fallback={<LoadingSkeleton />}>
                <SignupForm />
              </Suspense>
            </PageWithTitle>
          ),
        },
        {
          path: "forgot-pass",
          element: (
            <PageWithTitle title={title}>
              <Suspense fallback={<LoadingSkeleton />}>
                <ForgotForm />
              </Suspense>
            </PageWithTitle>
          ),
        },
      ],
    },
    {
      path: "/",
      element: <PrivateRoute element={<MainPage />} />,
      children: [
        {
          path: "users",
          element: (
            <PageWithTitle title={title}>
              <Suspense fallback={<LoadingSkeleton />}>
                <UserPage />
              </Suspense>
            </PageWithTitle>
          ),
        },
        {
          path: "settings",
          element: (
            <PageWithTitle title={title}>
              <Suspense fallback={<LoadingSkeleton />}>
                <Settings />
              </Suspense>
            </PageWithTitle>
          ),
        },
        {
          path: "classes",
          element: (
            <PageWithTitle title={title}>
              <Suspense fallback={<LoadingSkeleton />}>
                <ClassPage />
              </Suspense>
            </PageWithTitle>
          ),
        },
        {
          path: "building",
          element: (
            <PageWithTitle title={title}>
              <Suspense fallback={<LoadingSkeleton />}>
                <BuildingPage />
              </Suspense>
            </PageWithTitle>
          ),
        },
        {
          path: "student-list/class/:classId",
          element: (
            <PageWithTitle title={title}>
              <Suspense fallback={<LoadingSkeleton />}>
                <StudentPage />
              </Suspense>
            </PageWithTitle>
          ),
        },
        {
          path: "teachers",
          element: (
            <PageWithTitle title={title}>
              <Suspense fallback={<LoadingSkeleton />}>
                <TeacherPage />
              </Suspense>
            </PageWithTitle>
          ),
        },
        {
          path: "students",
          element: (
            <PageWithTitle title={title}>
              <Suspense fallback={<LoadingSkeleton />}>
                <FreshmenPageList />
              </Suspense>
            </PageWithTitle>
          ),
        },
        {
          path: "classroom",
          element: (
            <PageWithTitle title={title}>
              <Suspense fallback={<LoadingSkeleton />}>
                <ClassroomPage />
              </Suspense>
            </PageWithTitle>
          ),
        },
        {
          path: "courses",
          element: (
            <PageWithTitle title={title}>
              <Suspense fallback={<LoadingSkeleton />}>
                <CoursePage />
              </Suspense>
            </PageWithTitle>
          ),
        },
        {
          path: "module",
          element: (
            <PageWithTitle title={title}>
              <Suspense fallback={<LoadingSkeleton />}>
                <ModulePage />
              </Suspense>
            </PageWithTitle>
          ),
        },
        {
          path: "coursefamily",
          element: (
            <PageWithTitle title={title}>
              <Suspense fallback={<LoadingSkeleton />}>
                <CoursesFamilyPage />
              </Suspense>
            </PageWithTitle>
          ),
        },
        {
          path: "classroom/building/:buildingId/classrooms",
          element: (
            <PageWithTitle title={title}>
              <Suspense fallback={<LoadingSkeleton />}>
                <ClassroomPage />
              </Suspense>
            </PageWithTitle>
          ),
        },
        {
          path: "schedule/class/:classId",
          element: (
            <PageWithTitle title={title}>
              <Suspense fallback={<LoadingSkeleton />}>
                <ScheduleList />
              </Suspense>
            </PageWithTitle>
          ),
        },
        {
          path: "/schedule/attendance/:scheduleId",
          element: (
            <PageWithTitle title={title}>
              <Suspense fallback={<LoadingSkeleton />}>
                <AttendancePage />
              </Suspense>
            </PageWithTitle>
          ),
        },
        {
          path: "promotions",
          element: (
            <PageWithTitle title={title}>
              <Suspense fallback={<LoadingSkeleton />}>
                <PromotionPage />
              </Suspense>
            </PageWithTitle>
          ),
        },
        {
          path: "admission",
          element: (
            <PageWithTitle title={title}>
              <Suspense fallback={<LoadingSkeleton />}>
                <AdmissionPage />
              </Suspense>
            </PageWithTitle>
          ),
        },
        {
          path: "admission/:admissionId",
          element: (
            <PageWithTitle title={title}>
              <Suspense fallback={<LoadingSkeleton />}>
                <AdmissionDetail />
              </Suspense>
            </PageWithTitle>
          ),
        },
        {
          path: "applicationdocument",
          element: (
            <PageWithTitle title={title}>
              <Suspense fallback={<LoadingSkeleton />}>
                <ApplicationDocumentPage />
              </Suspense>
            </PageWithTitle>
          ),
        },
        {
          path: "/admission/:admissionId/application",
          element: (
            <PageWithTitle title={title}>
              <Suspense fallback={<LoadingSkeleton />}>
                <AddApplicationForm />
              </Suspense>
            </PageWithTitle>
          ),
        },
        {
          path: "/",
          element: (
            <PageWithTitle title={title}>
              <Suspense fallback={<LoadingSkeleton />}>
                <DashBoardPage />
              </Suspense>
            </PageWithTitle>
          ),
        },
      ],
    },
    {
      path: "/*",
      element: (
        <PageWithTitle title={title}>
          <Suspense fallback={<LoadingIndicator />}>
            <ErrorPage />
          </Suspense>
        </PageWithTitle>
      ),
    },
  ]);

  return routes;
}

export default MainRoutes;
