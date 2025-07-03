import ArgumentPreview from "./ArgumentPreview";
import FileUploader from "./FileUploader";
import { useState } from "react";

export default function HomePage() {
  const [file, setFile] = useState(null);
  const [argumentsText, setArgumentsText] = useState("");
  const [loading, setLoading] = useState(false);

const handleExtract = async () => {
  if (!file) return alert("Please select a file");

  const formData = new FormData();
  formData.append("document", file);

  setLoading(true);
  try {
    const res = await fetch("http://localhost:8000/extract", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setArgumentsText(data.arguments);

    
    document.querySelector("#preview-panel")?.scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    console.error("Error extracting:", err);
    alert("Failed to extract arguments");
  } finally {
    setLoading(false);
  }
};

  const handleSaveToDocs = async () => {
    if (!argumentsText) return;

    try {
      const res = await fetch("http://localhost:8000/save-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: argumentsText }),
      });

      const data = await res.json();
      window.open(data.doc_link, "_blank");
    } catch (err) {
      console.error("Error saving:", err);
      alert("Failed to save to Google Docs");
    }
  };

  const handleRegenerate = () => {
    handleExtract();
  };

  return (
    <div className="min-h-screen w-screen flex">
      {/* Left: Upload Section */}
      <div className="w-[30vw] min-h-screen p-6 bg-gray-50 border-r border-gray-300">
        <FileUploader 
          setFile={setFile} 
          onUpload={handleExtract} 
          loading={loading} 
        />
      </div>

      {/* Right: Argument Preview */}
      <ArgumentPreview 
        argumentsText={argumentsText}
        onSaveToDocs={handleSaveToDocs}
        onRegenerate={handleRegenerate}
        loading = {loading}
      />
    </div>
  );
}
