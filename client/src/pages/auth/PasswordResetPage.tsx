import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageContent from "../../components/PageContent";
import { useEffect, useRef, useState } from "react";
import {
  validateConfirmPassword,
  validatePassword,
} from "../../utils/validation";
import {
  useResetPasswordMutation,
  useValidateResetTokenQuery,
} from "../../features/authApi";
import { parseApiError } from "../../utils/parseApiError";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Eye, EyeOff } from "lucide-react";



const PasswordResetPage = () => {
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement | null>(null);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [errors, setErrors] = useState<{
    password?: string | null;
    confirmPassword?: string | null;
    token?: string | null;
  }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { error, isLoading: isValidating } = useValidateResetTokenQuery(
    token ?? "",
    { skip: !token }
  );

  useEffect(() => {
    if (!token?.trim()) {
      setErrors({ token: "Invalid or missing reset token." });
      return;
    }

    if (error) {
      const status = "status" in error ? error.status : null;
      if (status === 401) {
        setErrors({
          token: "Invalid or expired reset token. Please request a new one.",
        });
      } else {
        setErrors({
          token: "An unexpected error occurred while validating the token.",
        });
      }
    } else {
      setErrors({});
    }
  }, [token, error]);

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErrors({ token: "Invalid or missing reset token." });
      return;
    }

    setErrors({ password: null, confirmPassword: null, token: null });
    setApiError(null);

    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(
      password,
      confirmPassword
    );

    if (passwordError || confirmPasswordError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });

      if (passwordError) {
        passwordInputRef.current?.focus();
      } else if (confirmPasswordError) {
        confirmPasswordInputRef.current?.focus();
      }

      return;
    }

    try {
      const result = await resetPassword({ password, token });
      if ("data" in result && result?.data?.success) {
        setErrors({ password: null, confirmPassword: null, token: null });
        setApiError(null);
        navigate("/auth");
      } else if ("error" in result) {
        setApiError(parseApiError(result.error));
        return;
      } else {
        setApiError("Unexpected response.");
        return;
      }
    } catch (err: unknown) {
      const parsedError = parseApiError(err);
      setApiError(parsedError);
      return;
    }
  };

  return (
    <PageContent className="flex flex-col items-center justify-center">
      <section
        aria-labelledby="reset-password-heading"
        className="w-full md:w-160 border border-blue-950 bg-blue-200 dark:bg-blue-900 shadow-lg"
      >
        <h1
          id="reset-password-heading"
          className="font-semibold text-lg xl:text-2xl text-center m-8 mx-auto"
        >
          Reset Password Form
        </h1>

        {!isValidating && errors?.token ? (
          <div className="flex flex-col items-center">
            <p className="text-red-600 text-center">{errors.token}</p>
            <Link to="/recover-password" className="text-blue-600 underline">
              Request a new password reset
            </Link>
          </div>
        ) : (
          <form
            className="flex flex-col p-4"
            onSubmit={handleResetPasswordSubmit}
            aria-invalid={!!apiError}
            aria-labelledby="reset-password-heading"
            aria-describedby={apiError ? "api-error" : undefined}
          >
            <div className="flex flex-col px-8 xl:px-16 items-start w-full my-2">
              <label
                htmlFor="password"
                className="font-semibold text-sm xl:text-base"
              >
                New Password:
              </label>
              <div className="flex items-center w-full bg-gray-200 text-gray-950 rounded-sm border border-gray-950 h-10 px-4">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="flex-1 bg-transparent outline-none text-sm xl:text-base"
                  placeholder="New Password..."
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: null }));
                  }}
                  onBlur={() => {
                    const passwordError = validatePassword(password);
                    setErrors((prev) => ({ ...prev, password: passwordError }));
                  }}
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  aria-required="true"
                  ref={passwordInputRef}
                  disabled={isLoading || isValidating}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="ml-2 text-sm text-gray-800"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                  <EyeOff className="w-5 h-5"/>
                ) : (
                  <Eye className="w-5 h-5"/>
                )}
                </button>
              </div>
            </div>

            {errors?.password && (
              <p
                id="password-error"
                className="text-red-600 text-xs px-16 mt-0.25 mb-2"
              >
                {errors.password}
              </p>
            )}

            <div className="flex flex-col px-8 xl:px-16 items-start w-full my-2">
              <label
                htmlFor="confirmPassword"
                className="font-semibold text-sm xl:text-base"
              >
                Confirm Password:
              </label>

              <div className="flex items-center w-full bg-gray-200 text-gray-950 rounded-sm border border-gray-950 h-10 px-4">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="flex-1 bg-transparent outline-none text-sm xl:text-base"
                  placeholder="Confirm password..."
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, confirmPassword: null }));
                  }}
                  onBlur={() => {
                    const confirmPasswordError = validateConfirmPassword(
                      password,
                      confirmPassword
                    );
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: confirmPasswordError,
                    }));
                  }}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={
                    errors.confirmPassword
                      ? "confirm-password-error"
                      : undefined
                  }
                  aria-required="true"
                  ref={confirmPasswordInputRef}
                  disabled={isLoading || isValidating}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="ml-2 text-sm text-gray-800"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {errors?.confirmPassword && (
              <p
                id="confirm-password-error"
                className="text-red-600 text-xs px-16 mt-0.25 mb-2"
              >
                {errors.confirmPassword}
              </p>
            )}

            <div className="w-full text-center py-8 px-16">
              <button
                type="submit"
                disabled={isLoading || isValidating}
                className="bg-blue-400 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-400 hover:text-blue-200 dark:hover:text-blue-950 w-full py-2 rounded-sm ring-1 ring-blue-900 text-sm xl:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Loading..." : "Reset"}
              </button>
            </div>

            {apiError && (
              <p
                id="api-error"
                className="text-red-600 dark:text-red-400 text-center mb-4"
                role="alert"
                aria-live="assertive"
              >
                {apiError}
              </p>
            )}

            {(isValidating || isLoading) && (
              <div
                role="status"
                aria-live="polite"
                className="spinner w-full flex flex-row align-middle justify-center items-center text-center pb-4"
              >
                <LoadingSpinner />
              </div>
            )}

            <div className="flex flex-col items-center justify-center">
              <p className="text-xs font-extralight">
                Do you have an account?{" "}
                <Link
                  to="/auth"
                  className="text-blue-800 underline dark:text-blue-200 hover:text-red-600"
                >
                  Login
                </Link>
              </p>
              <p className="text-xs font-extralight">
                Don't you have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-800 underline dark:text-blue-200 hover:text-red-600"
                >
                  Register
                </Link>
              </p>
            </div>
          </form>
        )}
      </section>
    </PageContent>
  );
};

export default PasswordResetPage;
