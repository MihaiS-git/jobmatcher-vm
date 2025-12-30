import { Link } from "react-router-dom";
import ThemeToggleButton from "./ThemeToggleButton";
import MainNavigation from "./MainNavigation";
import Hamburger from "./Hamburger";
import DemoComponent from "./DemoComponent";
import { useAppSelector } from "@/hooks/hooks";

const Header = () => {
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <header className="">
      <div className="flex flex-col">
        <div className="fixed top-0 left-0 right-0 h-16 z-40 w-full p-4 flex justify-between items-center xl:px-80 bg-blue-600 dark:bg-gray-900 text-blue-100 dark:text-gray-300">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl lg:text-2xl font-extrabold hover:text-blue-950 dark:hover:text-blue-400 whitespace-nowrap">
              Job Matcher
            </h1>
          </Link>
          {!isAuth && <DemoComponent />}
          <MainNavigation />
          <div className="flex flex-row gap-2">
            <ThemeToggleButton />
            <Hamburger />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
