import { useEffect, useState } from "react";
import axios from "axios";

export default function MyFiles({ fetchFiles }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [rawData, setRawData] = useState([]);
  const [narrativeData, setNarrativeData] = useState([]);
  const [defaultData, setDefaultData] = useState([]);
  const [viewMode, setViewMode] = useState("default"); 

  useEffect(() => {
    fetchAndSetDefaultFiles();
  }, []);

const fetchAndSetDefaultFiles = async () => {
  try {
    const res = await axios.get("http://localhost:5000/list-files/narrative-arguments");
    if (res?.data) {
      setNarrativeData(res.data);
      setViewMode("narrative");
    }
  } catch (err) {
    console.error("❌ Error fetching default narrative arguments:", err);
  }
};
 const handleRefresh = () => {
  fetchAndSetDefaultFiles(); 
};

  const handleExtractedArguments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/list-files/extracted-arguments");
      if (res?.data) {
        setRawData(res.data);
        setViewMode("raw");
      }
    } catch (err) {
      console.error("❌ Error fetching raw arguments:", err);
    }
  };

  const handleNarrativeArguments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/list-files/narrative-arguments");
      if (res?.data) {
        setNarrativeData(res.data);
        setViewMode("narrative");
      }
    } catch (err) {
      console.error("❌ Error fetching narrative arguments:", err);
    }
  };

  const getVisibleData = () => {
    const source =
      viewMode === "raw"
        ? rawData
        : viewMode === "narrative"
        ? narrativeData
        : defaultData;

    return source.filter((file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredFiles = getVisibleData();

  return (
    <div className="p-6 bg-white rounded-xl shadow w-full h-full overflow-y-auto flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search documents..."
          className="px-4 py-2 rounded-lg border w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleExtractedArguments}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Raw-Arguments
        </button>
        <button
          onClick={handleNarrativeArguments}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Narrated-Arguments
        </button>
        <button
          onClick={handleRefresh}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm"
        >
          Refresh
        </button>
      </div>

      <div className="mt-2">
        {filteredFiles.length === 0 ? (
          <p className="text-gray-500">No files found.</p>
        ) : (
          <ul className="space-y-3 mt-2">
            {filteredFiles.map((file, idx) => (
              <li key={idx}>
                <a
                  href={file.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-lg"
                >
                  📄 {file.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
