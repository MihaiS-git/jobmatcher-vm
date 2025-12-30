import FeedbackMessage from "@/components/FeedbackMessage";
import { useUploadPortfolioItemImagesMutation } from "@/features/profile/portfolio/portfolioApi";
import { parseApiError } from "@/utils/parseApiError";
import { validateImageFile } from "@/utils/validation";
import { useRef, useState } from "react";

interface MultiFileUploadFormProps {
  itemId: string;
  userId: string;
}

const MultiFileUploadForm = ({ itemId, userId }: MultiFileUploadFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [uploadFile, { isLoading: isUploading, error: uploadError }] =
    useUploadPortfolioItemImagesMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setApiError(null);
    setSuccessMessage(null);

    const errors: string[] = [];
    const validFiles: File[] = [];

    files.forEach((file) => {
      const error = validateImageFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length) {
      setValidationError(errors.join("\n"));
    } else {
      setValidationError(null);
    }

    setSelectedFiles(validFiles);
    setCurrentIndex(0);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMessage(null);

    if (!selectedFiles.length) {
      setApiError("No files selected.");
      return;
    }

    const file = selectedFiles[currentIndex];
    if (!file) return;

    const result = await uploadFile({ portfolioItemId: itemId, userId , files: selectedFiles });
    if ("error" in result) {
      setApiError(parseApiError(result.error));
    } else {
      setSuccessMessage("Images uploaded successfully.");
      setCurrentIndex((prev) => prev + 1);
      
      setTimeout(() => {
      setSuccessMessage(null);
      setSelectedFiles([]);
      setCurrentIndex(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // reset file input
      }
    }, 3000);
    }
  };

  const buttonText = isUploading ? "Uploading..." : "Upload"

  return (
    <form
      onSubmit={handleUpload}
      className="flex flex-col items-center"
      noValidate
    >
      <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
        <label htmlFor="multiFileUpload">Upload portfolio images:</label>
        <input
          id="multiFileUpload"
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleChange}
          className="bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border text-sm xl:text-base border-gray-950"
        />

        {selectedFiles.length > 0 && (
          <ul className="mt-2 text-sm max-w-80 break-words whitespace-normal">
            {selectedFiles.map((file, index) => (
              <li
                key={file.name}
                className={index === currentIndex ? "font-bold" : ""}
              >
                {file.name}
              </li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-gray-200 p-2 rounded-sm border border-gray-200 hover:bg-blue-400 mt-4 w-80 disabled:bg-gray-400"
          disabled={
            isUploading ||
            !selectedFiles.length ||
            currentIndex >= selectedFiles.length
          }
        >
          {buttonText}
        </button>
        <div className="min-h-[2.5rem] flex items-center justify-center">
          {validationError && (
            <FeedbackMessage
              id="validation-error"
              message={validationError}
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
          {uploadError && (
            <FeedbackMessage
              id="upload-error"
              message={parseApiError(uploadError)}
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

export default MultiFileUploadForm;
