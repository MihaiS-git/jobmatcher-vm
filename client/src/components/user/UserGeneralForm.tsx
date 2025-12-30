import { useEffect, useRef, useState } from "react";
import type { UserResponseDTO } from "../../types/UserDTO";
import focusFirstError from "../../utils/focusFirstError";
import { validateName, validatePhone } from "../../utils/validation";
import { useUpdateUserByIdMutation } from "../../features/user/userApi";
import { parseApiError } from "../../utils/parseApiError";
import FormInput from "../forms/FormInput";

const UserGeneralForm = ({ user }: { user: UserResponseDTO }) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [errorsGeneral, setErrorsGeneral] = useState<{
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
  }>({});

  const [apiErrorGeneral, setApiErrorGeneral] = useState<string | null>(null);

  const refsGeneral = {
    firstName: useRef<HTMLInputElement>(null),
    lastName: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
  };

  const [updateUserProfileGeneral, { isLoading, error }] =
    useUpdateUserByIdMutation();

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const validateGeneral = () => {
    const errors = {
      firstName: validateName(firstName),
      lastName: validateName(lastName),
      phone: validatePhone(phone),
    };
    setErrorsGeneral(errors);
    return errors;
  };

  const handleUserGeneralFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiErrorGeneral(null);
    const errors = validateGeneral();
    if (Object.values(errors).some((error) => error)) {
      focusFirstError(errors, refsGeneral);
      return;
    }
    try {
      const result = await updateUserProfileGeneral({
        id: user.id,
        data: { firstName, lastName, phone },
      });
      if ("data" in result) {
        setSuccessMessage("Profile updated successfully.");
      } else {
        setApiErrorGeneral(parseApiError(result.error));
      }
    } catch (err) {
      setApiErrorGeneral(parseApiError(err));
    }
  };

  if (isLoading)
    return <div className="pt-4">Loading general info data...</div>;
  if (error) return <div className="pt-4">Error loading profile.</div>;
  if (!user) return <div className="pt-4">No user data found.</div>;

  return (
    <>
      <hr className="bg-gray-300 dark:bg-gray-500 border-0 border-gray-200 w-full pt-0.25 mt-8" />
      <h2 className="text-base font-semibold pt-4">General Info Update Form</h2>
      <form
        className="flex flex-col items-center"
        onSubmit={handleUserGeneralFormSubmit}
        aria-describedby={apiErrorGeneral ? "api-error-general" : undefined}
        noValidate
      >
        <FormInput
          id="firstName"
          label="First name:"
          type="text"
          name="firstName"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
            setErrorsGeneral((prev) => ({ ...prev, firstName: null }));
          }}
          onBlur={() => {
            const err = validateName(firstName);
            setErrorsGeneral((prev) => ({ ...prev, firstName: err }));
          }}
          error={errorsGeneral.firstName}
          autoComplete="given-name"
          aria-required="true"
          ref={refsGeneral.firstName}
          disabled={isLoading}
        />

        <FormInput
          id="lastName"
          label="Last name:"
          type="text"
          name="lastName"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            setErrorsGeneral((prev) => ({ ...prev, lastName: null }));
          }}
          onBlur={() => {
            const err = validateName(lastName);
            setErrorsGeneral((prev) => ({ ...prev, lastName: err }));
          }}
          error={errorsGeneral.lastName}
          autoComplete="family-name"
          aria-required="true"
          ref={refsGeneral.lastName}
          disabled={isLoading}
        />

        <FormInput
          id="phone"
          label="Phone:"
          type="text"
          name="phone"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setErrorsGeneral((prev) => ({ ...prev, phone: null }));
          }}
          onBlur={() => {
            const err = validatePhone(phone);
            setErrorsGeneral((prev) => ({ ...prev, phone: err }));
          }}
          error={errorsGeneral.phone}
          autoComplete="tel"
          aria-required="true"
          ref={refsGeneral.phone}
          disabled={isLoading}
        />

        <button
          type="submit"
          className="bg-blue-500 text-gray-200 p-2 rounded-sm border border-gray-200 hover:bg-blue-400 mt-4 w-80"
          disabled={isLoading}
        >
          Submit
        </button>
        {apiErrorGeneral && (
          <p
            id="api-error-general"
            className="text-red-600 dark:text-red-400 text-center my-4"
            role="alert"
            aria-live="assertive"
          >
            {apiErrorGeneral}
          </p>
        )}
        {successMessage && (
          <p
            id="api-error-address"
            className="text-green-400 text-center my-4"
            role="alert"
            aria-live="assertive"
          >
            {successMessage}
          </p>
        )}
      </form>
    </>
  );
};

export default UserGeneralForm;
