import { useSelector } from "react-redux";
import type { RootState } from "../store";

// Hook to access auth state from Redux store
const useAuth = () => {
    const auth = useSelector((state: RootState) => state.auth);
    return auth;
};

export default useAuth;