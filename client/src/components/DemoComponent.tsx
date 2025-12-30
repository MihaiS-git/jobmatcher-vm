import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/hooks";
import { clearCredentials, setCredentials } from "../features/authSlice";
import { useIsAuth } from "@/hooks/isAuth";
import { useLoginMutation } from "@/features/authApi";
import { useEffect, useRef, useState } from "react";
import { parseApiError } from "@/utils/parseApiError";
import LoadingSpinner from "./LoadingSpinner";
import FeedbackMessage from "./FeedbackMessage";
import { Button } from "./ui/button";

const DemoComponents = () => {
  const apiErrorRef = useRef<HTMLParagraphElement | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuth = useIsAuth();
  const [login, { isLoading, error }] = useLoginMutation();
  const [apiError, setApiError] = useState<string | null>(null);

  const demoAccounts = {
    freelancer: {
      email: "user0@jobmatcher.com",
      password: "Password!23",
    },
    customer: {
      email: "user1@jobmatcher.com",
      password: "Password!23",
    },
  };

  const handleLogout = () => {
    dispatch(clearCredentials());
    dispatch({ type: "auth/logout" });
    navigate("/");
  };

  const handleDemoLogin = async (type: "freelancer" | "customer") => {
    if (isAuth) {
      handleLogout();
      return;
    }

    setApiError(null);
    const { email, password } = demoAccounts[type];

    try {
      const result = await login({ email, password }).unwrap();
      if (result && result.token && result.user && result.refreshToken) {
        dispatch(
          setCredentials({
            user: result.user,
            token: result.token,
            refreshToken: result.refreshToken,
          })
        );
        navigate("/");
      } else {
        throw new Error("Login failed: Invalid response from server");
      }
    } catch (err: unknown) {
      console.error("Login failed", err);
      const parsedError = parseApiError(err);
      setApiError(parsedError);
    }
  };

  useEffect(() => {
    if (error) {
      setApiError(parseApiError(error));
      apiErrorRef.current?.focus();
    }
  }, [error]);

  return (
    <section className="max-w-md p-1 mx-1 lg:ms-8 text-base bg-blue-400 dark:bg-gray-700 rounded-sm">
      <div className="max-w-md flex flex-col gap-1 justify-center align-middle items-center">
        <Button onClick={() => handleDemoLogin("freelancer")} variant="destructive" className="w-20 h-6 rounded-sm gap-0.5 px-1 has-[>svg]:px-0.5 text-xs animate-pulse" size="sm">
          {(isLoading || apiError) ? (
            <LoadingSpinner size={12} fullScreen={false} />
          ) : (
            "Freelancer"
          )}
        </Button>
        <Button onClick={() => handleDemoLogin("customer")} variant="destructive" className="w-20 h-6 rounded-sm gap-0.5 px-1 has-[>svg]:px-0.5 text-xs animate-pulse" size="sm">
          {(isLoading || apiError) ? (
            <LoadingSpinner size={12} fullScreen={false} />
          ) : (
            "Customer"
          )}
        </Button>
      </div>
      {apiError && <FeedbackMessage message={apiError} />}
    </section>
  );
};

DemoComponents.displayName = "DemoComponents";

export default DemoComponents;
