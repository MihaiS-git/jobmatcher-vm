import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { clearCredentials } from "../features/authSlice";
import CloseButton from "./CloseButton";
import DashboardDrawerToggleButton from "./DashboardDrawer/DashboardDrawerToggleButton";

interface HamburgerMenuProps {
  openState: boolean;
  handleClose: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  openState,
  handleClose,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(clearCredentials());
    dispatch({ type: "auth/logout" });
    navigate("/auth");
    handleClose();
  };

  return (
    <>
      <div
        className={`fixed top-0 left-1/2 transform -translate-x-1/2 w-full h-screen p-6 bg-blue-500 dark:bg-gray-800 shadow-lg z-100 overflow-auto 
        transition-all duration-500 ease-in-out ${
          openState
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="grid grid-cols-12">
          <ul className="col-span-12 mx-auto flex flex-col items-center space-y-8 overflow-auto mt-32 mb-32">
            <li>
              <NavLink
                to="/"
                className="hover:text-blue-950 dark:hover:text-blue-400 cursor-pointer"
                onClick={handleClose}
              >
                Home
              </NavLink>
            </li>
            {isAuth && (
              <>
                <li onClick={handleClose}>
                  <DashboardDrawerToggleButton />
                </li>
                <li onClick={handleClose}>
                  <NavLink to={"/job-feed"} className="hover:text-blue-950 dark:hover:text-blue-400 cursor-pointer">Job Feed</NavLink>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="hover:text-blue-950 dark:hover:text-blue-400 cursor-pointer"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
            {!isAuth && (
              <li>
                <NavLink
                  to="/auth"
                  className="hover:text-blue-950 dark:hover:text-blue-400 cursor-pointer"
                  onClick={handleClose}
                >
                  Sign In
                </NavLink>
              </li>
            )}
          </ul>
          <div className="col-start-12 col-end-12 flex flex-col justify-end items-end">
            <CloseButton handleClose={handleClose} />
          </div>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;
