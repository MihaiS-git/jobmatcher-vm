import { Link } from "react-router-dom";

const Footer: React.FC = () => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 w-full h-16 z-40 p-2 text-base text-center font-extrabold bg-blue-600 dark:bg-gray-900 text-blue-100 dark:text-gray-300">
                        <p className="hover:text-red-hover">
                <Link to="https://brutecx.vercel.app/">
                    <span>Brutecx</span> © 2025
                </Link>
            </p>
            <span className="font-light text-xs">- Demo project -</span>
        </footer>
    );
};

export default Footer;