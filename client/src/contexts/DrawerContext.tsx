import { useState, type ReactNode } from "react";
import { DashboardDrawerContext } from "../types/DrawerContextType";

type DrawerProviderProps = {
    children: ReactNode;
};

export const DashboardDrawerProvider = ({children}: DrawerProviderProps) => {
    const [isDashboardDrawerOpen, setIsDashboardDrawerOpen] = useState(false);

    const open = () => setIsDashboardDrawerOpen(true);
    const close = () => setIsDashboardDrawerOpen(false);
    const toggle = () => setIsDashboardDrawerOpen((prev) => !prev);

    return (
        <DashboardDrawerContext.Provider value={{isDashboardDrawerOpen, open, close, toggle}}>
            {children}
        </DashboardDrawerContext.Provider>
    );
};

