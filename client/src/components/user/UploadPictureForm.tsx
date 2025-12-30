import { useRef, useState } from "react";
import { useUploadProfilePictureMutation } from "../../features/user/userApi";
import FeedbackMessage from "../FeedbackMessage";
import type { UserResponseDTO } from "../../types/UserDTO";
import { parseApiError } from "../../utils/parseApiError";
import { validateImageFile } from "../../utils/validation";

const UploadPictureForm = ({ user }: { user: UserResponseDTO }) => {
  const [apiError, setApiError] = useState<string | null>(null);
  const fileUploadRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageFileError, setImageFileError] = useState<string | null>(null);
  const [uploadFile, { isLoading: isUploading, error: uploadingError }] =
    useUploadProfilePictureMutation();
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setImageFileError(null)

    if (!selectedFile) {
      setApiError("No file selected.");
      return;
    }

    const result = await uploadFile({ id: user!.id, file: selectedFile });
    if ("error" in result) {
      setApiError(parseApiError(result.error));
    } else if ("data" in result) {
      setSelectedFile(null);
      if (fileUploadRef.current) fileUploadRef.current.value = "";
      setSuccessMessage("File uploaded successfully.");
    } else {
      setApiError("An unexpected error occurred.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateImageFile(file);

    setApiError(null);
    setSuccessMessage("");

    if (error) {
      setImageFileError(error);
      return;
    }

    setImageFileError("");
    setApiError("");
    setSelectedFile(file);
    setSuccessMessage("");
  };

  return (
    <form
      onSubmit={handleFileUpload}
      className="flex flex-col items-center"
      aria-describedby={apiError ? "api-error" : undefined}
      noValidate
    >
      <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
        <label htmlFor="fileUpload">Change picture:</label>
        <input
          className="bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border text-sm xl:text-base border-gray-950"
          type="file"
          id="fileUpload"
          ref={fileUploadRef}
          aria-invalid={!!uploadingError}
          aria-describedby={
            imageFileError
              ? "fileUpload-error"
              : apiError
              ? "api-error"
              : undefined
          }
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-blue-500 text-gray-200 p-2 rounded-sm border border-gray-200 hover:bg-blue-400 mt-4 w-80 disabled:bg-gray-400"
          disabled={isUploading || !!imageFileError || !!apiError || !selectedFile}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>

        <div className="min-h-[2.5rem] flex items-center justify-center">
          {imageFileError && (
            <FeedbackMessage
              id="fileUpload-error"
              message={imageFileError}
              type="error"
            />
          )}
          {apiError && (
            <FeedbackMessage
              id="api-error"
              message={apiError}
              type="error"
            />
          )}
          {successMessage && (
            <FeedbackMessage
              id="upload-success"
              message={successMessage}
              type="success"
            />
          )}
        </div>
      </div>
    </form>
  );
};

export default UploadPictureForm;
