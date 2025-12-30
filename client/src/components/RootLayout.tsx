import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { lazy, Suspense, useEffect } from "react";
import { useDashboardDrawer } from "../hooks/useDashboardDrawer";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

const DashboardDrawer = lazy(() => import("./DashboardDrawer/DashboardDrawer"));

const RootLayout = () => {
  const { isDashboardDrawerOpen, close } = useDashboardDrawer();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.user) close();
  }, [auth, close]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex flex-1 pt-16">
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            isDashboardDrawerOpen ? "ml-80" : ""
          }`}
        >
          <Outlet />
        </main>
        {isDashboardDrawerOpen && (
          <Suspense fallback={<LoadingSpinner fullScreen={false} size={24} />}>
            <DashboardDrawer />
          </Suspense>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default RootLayout;
