import { Link, useNavigate } from "react-router-dom";
import PageContent from "../../components/PageContent";
import { useRegisterMutation } from "../../features/authApi";
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from "../../utils/validation";
import { useRef, useState } from "react";
import { parseApiError } from "../../utils/parseApiError";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Eye, EyeOff } from "lucide-react";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

const RegistrationPage = () => {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);
  const firstNameInputRef = useRef<HTMLInputElement>(null);
  const lastNameInputRef = useRef<HTMLInputElement>(null);
  const roleSelectRef = useRef<HTMLFieldSetElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const [errors, setErrors] = useState<{
    email?: string | null;
    password?: string | null;
    confirmPassword?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    role?: string | null;
  }>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const validateAll = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(
      password,
      confirmPassword
    );
    const firstNameError = validateName(firstName);
    const lastNameError = validateName(lastName);
    const roleError = !role ? "You must select a role." : null;
    const newErrors = {
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
      firstName: firstNameError,
      lastName: lastNameError,
      role: roleError,
    };
    setErrors(newErrors);
    return newErrors;
  };

  const handleRegisterFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({
      email: null,
      password: null,
      confirmPassword: null,
      firstName: null,
      lastName: null,
      role: null,
    });
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

    if (currentErrors.confirmPassword) {
      confirmPasswordInputRef.current?.focus();
      return;
    }

    if (currentErrors.firstName) {
      firstNameInputRef.current?.focus();
      return;
    }

    if (currentErrors.lastName) {
      lastNameInputRef.current?.focus();
      return;
    }

    if (currentErrors.role) {
      roleSelectRef.current?.focus();
      return;
    }

    try {
      const result = await register({
        email,
        password,
        firstName,
        lastName,
        role,
      });
      if ("data" in result && result?.data?.success) {
        setErrors({
          email: null,
          password: null,
          confirmPassword: null,
          firstName: null,
          lastName: null,
          role: null,
        });
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
      const parsedApiError = parseApiError(err);
      setApiError(parsedApiError);
      return;
    }
  };

  return (
    <PageContent className="flex flex-col items-center justify-center">
      <section
        aria-labelledby="register-heading"
        className="w-full md:w-160 border border-blue-950 bg-blue-200 dark:bg-blue-900 shadow-lg my-16 overflow-y-auto"
      >
        <h1
          id="register-heading"
          className="font-semibold text-lg xl:text-2xl text-center mt-4 mx-auto"
        >
          Registration Form
        </h1>
        {DEMO_MODE && (
          <div className="bg-yellow-200 border border-yellow-600 text-yellow-800 px-4 py-2 mx-8 mb-4 rounded-sm">
            <p className="text-sm">
              In demo mode, registration is disabled. Please use the
              predefined login buttons in navbar. Enjoy exploring the
              application!
            </p>
          </div>
        )}
        <form
          className="flex flex-col p-4"
          onSubmit={handleRegisterFormSubmit}
          aria-invalid={!!apiError}
          aria-labelledby="register-heading"
          aria-describedby={apiError ? "api-error" : undefined}
        >
          <div className="flex flex-col px-8 xl:px-16 items-start w-full my-1">
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
                setErrors((prev) => ({ ...prev, email: null }));
              }}
              onBlur={() => {
                const emailError = validateEmail(email);
                setErrors((prev) => ({ ...prev, email: emailError }));
              }}
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-required="true"
              ref={emailInputRef}
              disabled={isLoading || DEMO_MODE === true}
            />
          </div>
          {errors?.email && (
            <p
              id="email-error"
              className="text-red-600 dark:text-red-400 text-xs px-16 mt-0.25 mb-2"
            >
              {errors.email}
            </p>
          )}

          <div className="flex flex-col px-8 xl:px-16 items-start w-full my-2">
            <label
              htmlFor="password"
              className="font-semibold text-sm xl:text-base"
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
                disabled={isLoading || DEMO_MODE === true}
                autoComplete="new-password"
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
                value={confirmPassword}
                className="flex-1 bg-transparent outline-none text-sm xl:text-base"
                placeholder="Confirm password..."
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setApiError(null);
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
                  errors.confirmPassword ? "confirm-password-error" : undefined
                }
                aria-required="true"
                ref={confirmPasswordInputRef}
                disabled={isLoading || DEMO_MODE === true}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="ml-2 text-sm text-gray-800"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
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
              className="text-red-600 dark:text-red-400 text-xs px-16 mt-0.25 mb-2"
            >
              {errors.confirmPassword}
            </p>
          )}

          <div className="flex flex-col px-8 xl:px-16 items-start w-full my-2">
            <label
              htmlFor="firstName"
              className="font-semibold text-sm xl:text-base"
            >
              First Name:
            </label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={firstName}
              className="bg-gray-200 text-gray-950 p-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base h-10"
              placeholder="First Name..."
              onChange={(e) => {
                setFirstName(e.target.value);
                setErrors((prev) => ({ ...prev, firstName: null }));
              }}
              onBlur={() => {
                const firstNameError = validateName(firstName);
                setErrors((prev) => ({ ...prev, firstName: firstNameError }));
              }}
              autoComplete="given-name"
              aria-invalid={!!errors.firstName}
              aria-describedby={
                errors.firstName ? "first-name-error" : undefined
              }
              aria-required="true"
              ref={firstNameInputRef}
              disabled={isLoading || DEMO_MODE === true}
            />
          </div>
          {errors?.firstName && (
            <p
              id="first-name-error"
              className="text-red-600 dark:text-red-400 text-xs px-16 mt-0.25 mb-2"
            >
              {errors.firstName}
            </p>
          )}

          <div className="flex flex-col px-8 xl:px-16 items-start w-full my-2">
            <label
              htmlFor="lastName"
              className="font-semibold text-sm xl:text-base"
            >
              Last Name:
            </label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={lastName}
              className="bg-gray-200 text-gray-950 p-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base h-10"
              placeholder="Last Name..."
              onChange={(e) => {
                setLastName(e.target.value);
                setErrors((prev) => ({ ...prev, lastName: null }));
              }}
              onBlur={() => {
                const lastNameError = validateName(lastName);
                setErrors((prev) => ({ ...prev, lastName: lastNameError }));
              }}
              autoComplete="family-name"
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? "last-name-error" : undefined}
              aria-required="true"
              ref={lastNameInputRef}
              disabled={isLoading || DEMO_MODE === true}
            />
          </div>
          {errors?.lastName && (
            <p
              id="last-name-error"
              className="text-red-600 dark:text-red-400 text-xs px-16 mt-0.25 mb-2"
            >
              {errors.lastName}
            </p>
          )}

          <div className="flex flex-col px-8 xl:px-16 items-start w-full my-2">
            <fieldset
              className="flex flex-row justify-evenly w-full mt-2"
              ref={roleSelectRef}
              aria-describedby={errors.role ? "role-error" : undefined}
            >
              <legend className="font-semibold text-sm xl:text-base">
                Choose the desired role:
              </legend>

              <div className="flex flex-row items-center">
                <input
                  type="radio"
                  id="role-customer"
                  name="role"
                  value="CUSTOMER"
                  checked={role === "CUSTOMER"}
                  onChange={() => setRole("CUSTOMER")}
                  aria-required="true"
                  aria-invalid={errors.role ? "true" : "false"}
                  disabled={isLoading || DEMO_MODE === true}
                />
                <label htmlFor="role-customer" className="mx-4">
                  Customer
                </label>
              </div>

              <div className="flex flex-row items-center">
                <input
                  type="radio"
                  id="role-staff"
                  name="role"
                  value="STAFF"
                  checked={role === "STAFF"}
                  onChange={() => setRole("STAFF")}
                  aria-required="true"
                  aria-invalid={errors.role ? "true" : "false"}
                  disabled={isLoading || DEMO_MODE === true}
                />
                <label htmlFor="role-staff" className="mx-4">
                  Freelancer
                </label>
              </div>
            </fieldset>

            {errors.role && (
              <p
                id="role-error"
                className="text-red-600 dark:text-red-400 text-xs px-16 mt-0.25 mb-2 w-full text-center"
              >
                {errors.role}
              </p>
            )}
          </div>

          <div className="w-full px-16 text-center py-4">
            <button
              type="submit"
              className="bg-blue-400 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-400 hover:text-blue-200 dark:hover:text-blue-950 w-full py-2 rounded-sm ring-1 ring-blue-900 text-sm xl:text-base"
              disabled={isLoading || DEMO_MODE === true}
            >
              {isLoading ? "Submitting..." : "Submit"}
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
                className="text-blue-800 underline dark:text-blue-100 hover:text-red-500"
              >
                Login
              </Link>
            </p>
            <p className="text-xs font-extralight">
              Forgot your password?{" "}
              <Link
                to="/recover-password"
                className="text-blue-800 underline dark:text-blue-100 hover:text-red-500"
              >
                Reset Password
              </Link>
            </p>
          </div>
        </form>
      </section>
    </PageContent>
  );
};

export default RegistrationPage;
