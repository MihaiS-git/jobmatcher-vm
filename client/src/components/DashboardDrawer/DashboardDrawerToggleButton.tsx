import { useDashboardDrawer } from "@/hooks/useDashboardDrawer";

const DashboardDrawerToggleButton = () => {
  const { toggle, isDashboardDrawerOpen } = useDashboardDrawer();
  
  return (
    <button
      onClick={toggle}
      aria-label="Toggle dashboard drawer"
      className={`cursor-pointer ${
      isDashboardDrawerOpen
        ? "text-blue-950 dark:text-blue-400"
        : "hover:text-blue-950 dark:hover:text-blue-400"
    }`}
    >
      Dashboard
    </button>
  );
};

export default DashboardDrawerToggleButton;
