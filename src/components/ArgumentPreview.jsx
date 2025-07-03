export default function ArgumentPreview({ argumentsText, onSaveToDocs, onRegenerate }) {
  return (
    <div className="w-[70vw] min-h-screen p-6 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Extracted Arguments</h2>

      <div className="bg-gray-100 p-4 rounded-lg shadow-sm whitespace-pre-wrap min-h-[300px]">
        {argumentsText ? (
          <p className="text-gray-800">{argumentsText}</p>
        ) : (
          <p className="text-gray-600 italic">No content yet...</p>
        )}
      </div>

      {argumentsText && (
        <div className="mt-6 flex gap-4">
          <button
            onClick={onSaveToDocs}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
          >
            Save to Google Docs
          </button>

          <button
            onClick={onRegenerate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Regenerate
          </button>
        </div>
      )}
    </div>
  );
}
