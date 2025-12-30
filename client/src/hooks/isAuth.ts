import { useAppSelector } from "./hooks";

export const useIsAuth = () => {
    return useAppSelector((state) => state.auth.isAuthenticated);
};