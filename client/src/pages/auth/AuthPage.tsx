import { Link, useNavigate } from "react-router-dom";
import PageContent from "../../components/PageContent";
import { useEffect, useRef, useState } from "react";
import { useLoginMutation } from "../../features/authApi";
import { useAppDispatch } from "../../hooks/hooks";
import { setCredentials } from "../../features/authSlice";
import { validateEmail, validatePassword } from "../../utils/validation";
import { parseApiError } from "../../utils/parseApiError";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Eye, EyeOff } from "lucide-react";

if (!import.meta.env.VITE_API_ROOT_URL) {
  throw new Error("VITE_API_ROOT_URL is not defined.");
}
const API_ROOT_URL = import.meta.env.VITE_API_ROOT_URL;
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

const AuthPage = () => {
  const apiErrorRef = useRef<HTMLParagraphElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{
    email?: string | null;
    password?: string | null;
  }>({});
  const loginButtonText = isLoading ? "Logging in..." : "Login";

  const handleGoogleLogin = () => {
    setLoadingGoogle(true);
    window.location.href = `${API_ROOT_URL}/oauth2/authorization/google`;
  };

  const validateAll = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const newErrors = { email: emailError, password: passwordError };
    setErrors(newErrors);
    return newErrors;
  };

  const handleLoginFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
    setApiError(null);

    const currentErrors = validateAll();

    if (currentErrors.email) {
      emailInputRef.current?.focus();
      return;
    }
    if (currentErrors.password) {
      passwordInputRef.current?.focus();
      return;
    }

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
    if (apiError) {
      apiErrorRef.current?.focus();
    }
  }, [apiError]);

  return (
    <PageContent className="flex flex-col items-center justify-center">
      <section
        aria-labelledby="authentication-heading"
        className="w-full md:w-160 border border-blue-950 bg-blue-200 dark:bg-blue-900 shadow-lg"
      >
        <h1
          id="authentication-heading"
          className="font-semibold text-lg xl:text-2xl text-center m-8 mx-auto"
        >
          Authentication Form
        </h1>
        {DEMO_MODE && (
          <div className="bg-yellow-200 border border-yellow-600 text-yellow-800 px-4 py-2 mx-8 mb-4 rounded-sm">
            <p className="text-sm">
              In demo mode, authentication is disabled. Please use the
              predefined login buttons in navbar. Enjoy exploring the
              application!
            </p>
          </div>
        )}
        <form
          className="flex flex-col p-4"
          onSubmit={handleLoginFormSubmit}
          aria-invalid={!!apiError}
          aria-describedby={apiError ? "api-error" : undefined}
        >
          <div className="flex flex-col px-8 xl:px-16 items-start w-full my-2">
            <label
              htmlFor="email"
              className="font-semibold text-sm xl:text-base"
            >
              E-mail:
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={email}
              className="bg-gray-200 text-gray-950 p-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base h-10"
              placeholder="E-mail..."
              onChange={(e) => {
                setEmail(e.target.value);
                setApiError(null);
                setErrors((prev) => ({ ...prev, email: null }));
              }}
              onBlur={() => {
                const emailError = validateEmail(email);
                setErrors((prev) => ({ ...prev, email: emailError }));
              }}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-required="true"
              ref={emailInputRef}
              autoComplete="email"
              disabled={DEMO_MODE === true}
            />
          </div>

          {errors?.email && (
            <p
              id="email-error"
              role="alert"
              className="text-red-600 dark:text-red-400 text-xs px-16 mt-0.25 mb-2"
            >
              {errors.email}
            </p>
          )}

          <div className="flex flex-col px-8 xl:px-16 items-start w-full my-2">
            <label
              htmlFor="password"
              className="font-semibold text-sm xl:text-base mb-1"
            >
              Password:
            </label>
            <div className="flex items-center w-full bg-gray-200 text-gray-950 rounded-sm border border-gray-950 h-10 px-4">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                className="flex-1 bg-transparent outline-none text-sm xl:text-base"
                placeholder="Password..."
                onChange={(e) => {
                  setPassword(e.target.value);
                  setApiError(null);
                  setErrors((prev) => ({ ...prev, password: null }));
                }}
                onBlur={() => {
                  const passwordError = validatePassword(password);
                  setErrors((prev) => ({ ...prev, password: passwordError }));
                }}
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                aria-required="true"
                ref={passwordInputRef}
                autoComplete="current-password"
                disabled={DEMO_MODE === true}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-2 text-sm text-gray-800"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          {errors?.password && (
            <p
              id="password-error"
              role="alert"
              className="text-red-600 dark:text-red-400 text-xs px-16 mt-0.25 mb-2"
            >
              {errors.password}
            </p>
          )}

          <div className="w-full text-center py-8 px-16">
            <button
              type="submit"
              className="bg-blue-400 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-400 hover:text-blue-200 dark:hover:text-blue-950 w-full py-2 rounded-sm ring-1 ring-blue-900 text-sm xl:text-base"
              disabled={isLoading || DEMO_MODE === true}
            >
              {loginButtonText}
            </button>
          </div>

          {apiError && (
            <p
              id="api-error"
              ref={apiErrorRef}
              role="alert"
              tabIndex={-1}
              aria-live="assertive"
              className="text-red-600 dark:text-red-400 text-center mb-4"
            >
              {apiError}
            </p>
          )}

          {(isLoading || loadingGoogle) && (
            <div
              role="status"
              aria-live="polite"
              className="spinner w-full flex flex-row align-middle justify-center items-center text-center pb-4"
            >
              <LoadingSpinner fullScreen={false} />
            </div>
          )}

          <div className="flex flex-col items-center justify-center">
            <p className="text-xs font-extralight">
              Don't you have an account?{" "}
              <Link
                to="/register"
                className="text-blue-800 underline dark:text-blue-200 hover:text-red-500"
              >
                Register
              </Link>
            </p>
            <p className="text-xs font-extralight">
              Forgot your password?{" "}
              <Link
                to="/recover-password"
                className="text-blue-800 underline dark:text-blue-200 hover:text-red-500"
              >
                Reset Password
              </Link>
            </p>
          </div>
        </form>

        <hr />

        <div className="flex flex-row justify-center py-8 px-20 text-sm lg:text-base">
          <button
            onClick={handleGoogleLogin}
            className="bg-gray-200 text-gray-950 px-6 py-2 rounded-sm
         hover:bg-gray-300 transition mb-4 w-full flex items-center justify-center border border-gray-950"
            disabled={loadingGoogle || DEMO_MODE === true}
          >
            {loadingGoogle ? (
              "Loading..."
            ) : (
              <div className="flex items-center justify-between space-x-2">
                <img
                  src="google-logo.svg"
                  alt="google logo"
                  className="w-5 h-5"
                />
                <span>Sign in with Google</span>
              </div>
            )}
          </button>
        </div>
      </section>
    </PageContent>
  );
};

export default AuthPage;
