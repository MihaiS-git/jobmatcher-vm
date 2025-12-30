import { createContext } from "react";

export type DashboardDrawerContextType = {
    isDashboardDrawerOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;    
};

export const DashboardDrawerContext = createContext<DashboardDrawerContextType | null>(null);