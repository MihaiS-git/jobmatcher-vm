import { useDashboardDrawer } from "@/hooks/useDashboardDrawer";
import CloseButton from "../CloseButton";
import DrawerAccordion from "./DrawerAccordion";

const DashboardDrawer = () => {
  const { isDashboardDrawerOpen, close } = useDashboardDrawer();


  return (
    <div className="flex h-screen pt-16">
      {/* Backdrop only on mobile */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 ${
          isDashboardDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Drawer */}
      {isDashboardDrawerOpen && (
        <aside
          className={`fixed top-0 left-0 w-full h-screen 
          md:top-16 md:left-0 md:w-80 md:h-[calc(100%-4rem)] p-4
          bg-blue-500 dark:bg-gray-800 z-40 overflow-auto 
          transition-transform duration-300 ease-in-out 
          ${isDashboardDrawerOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          role="dialog"
          aria-modal="true"
        >
          <div className="pt-4 flex flex-col items-center md:items-start">
            <div className="w-full text-right">
              <CloseButton handleClose={close} />
            </div>
            <h2 className="text-xl font-bold my-8 dark:text-gray-300">
              Dashboard
            </h2>

            <DrawerAccordion close={close} />
          </div>
        </aside>
      )}
    </div>
  );
};

export default DashboardDrawer;
