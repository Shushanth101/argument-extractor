import { useState } from "react";

export default function FileUploader({ setFile, onUpload, loading }) {
  const [localFile, setLocalFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setLocalFile(file);
    setFile(file);
  };

  return (
    <>
      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-14 px-4 py-2"
      />
      <button
        onClick={onUpload}
        disabled={loading || !localFile}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition duration-200"
      >
        {loading ? "Extracting..." : "Extract Arguments"}
      </button>
    </>
  );
}


