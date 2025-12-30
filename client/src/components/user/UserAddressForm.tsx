import type { UserResponseDTO } from "../../types/UserDTO";
import { useEffect, useRef, useState } from "react";
import { useUpdateAddressByUserIdMutation } from "../../features/user/userApi";
import {
  validateName,
  validatePostalCode,
  validateStreet,
} from "../../utils/validation";
import focusFirstError from "../../utils/focusFirstError";
import { parseApiError } from "../../utils/parseApiError";
import FormInput from "../forms/FormInput";

const UserAddressForm = ({ user }: { user: UserResponseDTO }) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const [errorsAddress, setErrorsAddress] = useState<{
    street?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
  }>({});

  const [apiErrorAddress, setApiErrorAddress] = useState<string | null>(null);

  const refsAddress = {
    street: useRef<HTMLInputElement>(null),
    city: useRef<HTMLInputElement>(null),
    state: useRef<HTMLInputElement>(null),
    postalCode: useRef<HTMLInputElement>(null),
    country: useRef<HTMLInputElement>(null),
  };

  const [updateUserProfileAddress, { isLoading, error }] =
    useUpdateAddressByUserIdMutation();

  useEffect(() => {
    if (user) {
      setStreet(user.addressResponseDto?.street || "");
      setCity(user.addressResponseDto?.city || "");
      setState(user.addressResponseDto?.state || "");
      setPostalCode(user.addressResponseDto?.postalCode || "");
      setCountry(user.addressResponseDto?.country || "");
    }
  }, [user]);

  const validateAddress = () => {
    const errors = {
      street: validateStreet(street),
      city: validateName(city),
      state: validateName(state),
      postalCode: validatePostalCode(postalCode),
      country: validateName(country),
    };
    setErrorsAddress(errors);
    return errors;
  };

  const handleUserAddressFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiErrorAddress(null);
    const errors = validateAddress();
    if (Object.values(errors).some((error) => error)) {
      focusFirstError(errors, refsAddress);
      return;
    }
    try {
      const result = await updateUserProfileAddress({
        id: user.id,
        data: { street, city, state, postalCode, country },
      });
      if ("data" in result) {
        setSuccessMessage("Profile updated successfully.");
      } else {
        setApiErrorAddress(parseApiError(result.error));
      }
    } catch (err) {
      setApiErrorAddress(parseApiError(err));
    }
  };

  if (isLoading) return <div className="pt-4">Loading address data...</div>;
  if (error) return <div className="pt-4">Error loading profile.</div>;
  if (!user) return <div className="pt-4">No user data found.</div>;

  return (
    <>
      <hr className="bg-gray-300 dark:bg-gray-500 border-0 border-gray-200 w-full pt-0.25 mt-8" />
      <h3 className="text-base font-semibold pt-4">Address Update Form</h3>
      <form
        className="flex flex-col items-center pb-8"
        onSubmit={handleUserAddressFormSubmit}
        aria-describedby={apiErrorAddress ? "api-error-address" : undefined}
        noValidate
      >
        <FormInput
          id="street"
          label="Street:"
          type="text"
          name="street"
          value={street}
          onChange={(e) => {
            setStreet(e.target.value);
            setErrorsAddress((prev) => ({ ...prev, street: null }));
          }}
          onBlur={() => {
            const err = validateStreet(street);
            setErrorsAddress((prev) => ({ ...prev, street: err }));
          }}
          error={errorsAddress.street}
          autoComplete="address-line1"
          aria-required="true"
          ref={refsAddress.street}
          disabled={isLoading}
        />

        <FormInput
          id="city"
          label="City:"
          type="text"
          name="city"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setErrorsAddress((prev) => ({ ...prev, city: null }));
          }}
          onBlur={() => {
            const err = validateName(city);
            setErrorsAddress((prev) => ({ ...prev, city: err }));
          }}
          error={errorsAddress.city}
          autoComplete="address-level2"
          aria-required="true"
          ref={refsAddress.city}
          disabled={isLoading}
        />

        <FormInput
          id="state"
          label="State:"
          type="text"
          name="state"
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            setErrorsAddress((prev) => ({ ...prev, state: null }));
          }}
          onBlur={() => {
            const err = validateName(state);
            setErrorsAddress((prev) => ({ ...prev, state: err }));
          }}
          error={errorsAddress.state}
          autoComplete="address-level1"
          aria-required="true"
          ref={refsAddress.state}
          disabled={isLoading}
        />

        <FormInput
          id="postalCode"
          label="Postal Code:"
          type="text"
          name="postalCode"
          value={postalCode}
          onChange={(e) => {
            setPostalCode(e.target.value);
            setErrorsAddress((prev) => ({ ...prev, postalCode: null }));
          }}
          onBlur={() => {
            const err = validatePostalCode(postalCode);
            setErrorsAddress((prev) => ({ ...prev, postalCode: err }));
          }}
          error={errorsAddress.postalCode}
          autoComplete="postal-code"
          aria-required="true"
          ref={refsAddress.postalCode}
          disabled={isLoading}
        />

        <FormInput
          id="country"
          label="Country:"
          type="text"
          name="country"
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            setErrorsAddress((prev) => ({ ...prev, country: null }));
          }}
          onBlur={() => {
            const err = validateName(country);
            setErrorsAddress((prev) => ({ ...prev, country: err }));
          }}
          error={errorsAddress.country}
          autoComplete="country-name"
          aria-required="true"
          ref={refsAddress.country}
          disabled={isLoading}
        />

        <button
          type="submit"
          className="bg-blue-500 text-gray-200 p-2 rounded-sm border border-gray-200 hover:bg-blue-400 mt-4 w-80"
          disabled={isLoading}
        >
          Submit
        </button>

        {apiErrorAddress && (
          <p
            id="api-error-address"
            className="text-red-600 dark:text-red-400 text-center my-4"
            role="alert"
            aria-live="assertive"
          >
            {apiErrorAddress}
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

export default UserAddressForm;
