import ReactMarkdown from 'react-markdown';


export default function ArgumentPreview({ argumentsText, onSaveToDocs, onRegenerate ,loading}) {
  return (
    <div id="preview-panel" className="w-[70vw] min-h-screen p-6 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Extracted Arguments</h2>

      <div className="bg-gray-100 p-4 rounded-lg shadow-sm whitespace-pre-wrap min-h-[300px]">
        {argumentsText ? (
          <ReactMarkdown>{argumentsText}</ReactMarkdown>
        ) : (
          <p className="text-gray-600 italic">No content yet...</p>
        )}
      </div>

      {argumentsText && (
 <div className="flex gap-4 mt-6">
  <button
    onClick={onSaveToDocs}
    className="px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition duration-200 disabled:bg-green-300 disabled:cursor-not-allowed"
    disabled={!onSaveToDocs}
  >
    Save to Docs
  </button>

  <button
    onClick={onRegenerate}
    disabled={loading}
    className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
  >
    {loading ? "Regenerating..." : "Regenerate"}
  </button>
</div>
)}
    </div>
  );
}
