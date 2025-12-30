import { useContext } from "react";
import { DashboardDrawerContext } from "../types/DrawerContextType";

// Hook to access dashboard drawer context
export const useDashboardDrawer = () => {
    const context = useContext(DashboardDrawerContext);
    if(!context) throw new Error("useDrawer must be used within DrawerProvider");
    return context;
};