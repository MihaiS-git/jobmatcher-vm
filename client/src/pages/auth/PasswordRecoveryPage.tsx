import { Link } from "react-router-dom";
import PageContent from "../../components/PageContent";
import { useState } from "react";
import { validateEmail } from "../../utils/validation";
import { useRecoverPasswordMutation } from "../../features/authApi";
import { parseApiError } from "../../utils/parseApiError";
import LoadingSpinner from "../../components/LoadingSpinner";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

const PasswordRecoveryPage = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string | null }>({});
  const [message, setMessage] = useState("");
  const isSuccess = Boolean(message);
  const [apiError, setApiError] = useState<string | null>(null);
  const [recoverPassword, { isLoading }] = useRecoverPasswordMutation();

  const handlePasswordRecoveryFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({ email: null });
    setApiError(null);

    const emailError = validateEmail(email);

    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    try {
      await recoverPassword({ email }).unwrap();
      setMessage("Check your inbox for a password reset link.");
      setErrors({});
      setApiError(null);
    } catch (err: unknown) {
      console.error(err);
      const parsedError = parseApiError(err);
      setApiError(parsedError);
    }
  };

  return (
    <PageContent className="flex flex-col items-center justify-center">
      <section
        aria-labelledby="recover-password-heading"
        className="w-full md:w-160 border border-blue-950 bg-blue-200 dark:bg-blue-900 shadow-lg"
      >
        <h1
          id="recover-password-heading"
          className="font-semibold text-lg xl:text-2xl text-center m-8 mx-auto"
        >
          Recover Password Form
        </h1>
        {DEMO_MODE && (
          <div className="bg-yellow-200 border border-yellow-600 text-yellow-800 px-4 py-2 mx-8 mb-4 rounded-sm">
            <p className="text-sm">
              In demo mode, password recovery is disabled. Please use the
              predefined login buttons in navbar. Enjoy exploring the
              application!
            </p>
          </div>
        )}
        {message && (
          <p className="text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-800 px-4 py-2 mx-4 mb-4 rounded text-sm text-center">
            {message}
          </p>
        )}

        <form
          className="flex flex-col p-4"
          onSubmit={handlePasswordRecoveryFormSubmit}
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
                setApiError("");
                setMessage("");
                setErrors((prev) => ({ ...prev, email: null }));
              }}
              onBlur={() => {
                const emailError = validateEmail(email);
                setErrors((prev) => ({ ...prev, email: emailError }));
              }}
              disabled={isSuccess || DEMO_MODE === true}
              autoFocus
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-required="true"
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

          <div className="w-full text-center py-8 px-16">
            <button
              type="submit"
              className="bg-blue-400 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-400 hover:text-blue-200 dark:hover:text-blue-950 w-full py-2 rounded-sm ring-1 ring-blue-900 text-sm xl:text-base"
              disabled={isLoading || isSuccess || DEMO_MODE === true}
            >
              {isLoading ? "Loading..." : "Recover Password"}
            </button>
          </div>

          {apiError && (
            <p
              id="api-error"
              role="alert"
              tabIndex={-1}
              aria-live="assertive"
              className="text-red-600 dark:text-red-400 text-center mb-4"
            >
              {apiError}
            </p>
          )}

          {isLoading && (
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
                className="text-blue-800 underline dark:text-blue-200 hover:text-red-500"
              >
                Login
              </Link>
            </p>
            <p className="text-xs font-extralight">
              Don't you have an account?{" "}
              <Link
                to="/register"
                className="text-blue-800 underline dark:text-blue-200 hover:text-red-500"
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </section>
    </PageContent>
  );
};

export default PasswordRecoveryPage;
