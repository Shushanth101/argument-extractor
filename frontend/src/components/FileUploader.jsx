import { useState } from "react";
import axios from "axios";
import { XCircleIcon } from "@heroicons/react/24/solid";


export default function FileUploader({ fetchFiles, setData }) {
  const [files, setFiles] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUploads = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files,...selectedFiles]);
    setShowAll(false);
  };

  const uploadInBatches = async (fileArray, batchSize = 10) => {
    for (let i = 0; i < fileArray.length; i += batchSize) {
      const chunk = fileArray.slice(i, i + batchSize);
      const formData = new FormData();

      chunk.forEach((file) => {
        formData.append("files", file);
      });

      try {
        const res = await axios.post("http://localhost:5000/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(`✅ Batch ${i / batchSize + 1} uploaded:`, res.data);
      } catch (err) {
        console.error(`❌ Error uploading batch ${i / batchSize + 1}:`, err);
        break;
      }
    }
  };

const handleExtract = async () => {
  const averageTimePerBatch = 250; // seconds
  const batchSize = 10;
  const totalFiles = files.length;
  const totalBatches = Math.ceil(totalFiles / batchSize);
  const estimatedSeconds = totalBatches * averageTimePerBatch;

  const estimatedTimeStr =
    estimatedSeconds < 60
      ? `${estimatedSeconds} seconds`
      : `${Math.floor(estimatedSeconds / 60)} min ${estimatedSeconds % 60} sec`;

  const confirm = window.confirm(
    `⏱ Estimated time: ${estimatedTimeStr}\n\nDo you want to continue?`
  );

  if (!confirm) return;

  setUploading(true);

try {
  await uploadInBatches(files, batchSize);
  const res = await fetchFiles();

  setFiles([]); 
  setShowAll(false);

  if (res?.data) {
    setData(res.data);
  }
} catch (err) {
  console.error("❌ Error during extract:", err);
}

  setUploading(false);
};
const removeFile = (i)=>{
  const updatedFiles = [...files];
  updatedFiles.splice(i,1);
  setFiles(updatedFiles)
}


  const toggleShowAll = () => setShowAll((prev) => !prev);
  const previewFiles = showAll ? files : files.slice(0, 5);

  return (
    <div className="w-full h-full p-6 bg-white rounded-2xl shadow-xl flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-gray-800">Upload Files</h2>

      <label className="block">
        <span className="text-gray-700 font-medium">Select files</span>
        <input
          type="file"
          multiple
          className="mt-2 block w-full text-sm text-gray-600
                     file:mr-4 file:py-3 file:px-6
                     file:rounded-xl file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
          onChange={handleFileUploads}
        />
      </label>

      {files.length > 0 && (
  <div className="text-gray-800 text-sm">
    <p className="font-medium mb-1">Selected Files:</p>
    <ul className="pl-5 list-disc space-y-1 max-h-40 overflow-y-auto">
      {previewFiles.map((file, i) => (
        <li key={i} className="flex justify-between items-center">
          <span>{file.name}</span>
          <button onClick={() => removeFile(i)}>
  <XCircleIcon className="h-5 w-5 text-red-500 hover:text-red-700" />
</button>

        </li>
      ))}
    </ul>
    {files.length > 5 && (
      <button
        onClick={toggleShowAll}
        className="mt-2 text-blue-600 hover:underline text-sm font-medium"
      >
        {showAll ? "Show less ▲" : `+${files.length - 5} more ▼`}
      </button>
    )}
  </div>
)}


      <button
        onClick={handleExtract}
        disabled={uploading || files.length === 0}
        className={`px-6 py-3 rounded-xl font-semibold transition text-white ${
          uploading || files.length === 0
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {uploading ? "Extracting..." : "Extract"}
      </button>
    </div>
  );
}
