const mime = require("mime-types");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();
const { system_prompt,prompt, criticalVoicePrompt } = require("./system_prompt");
const pdfParse = require('pdf-parse');
const fs = require('fs/promises');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// async function extractArgumentsFromFile(filePath) {
//     console.log("request for gemini recieved!!")
//   try {
//     const buffer = await fs.readFile(filePath);
//     const base64 = Buffer.from(buffer).toString("base64");
//     const mimeType = "application/pdf"

//     const contents = [
//       { text: prompt },
//       {
//         inlineData: {
//           mimeType,
//           data: base64,
//         },
//       },
//     ];

//     const result = await ai.models.generateContent({
//       model: "gemini-2.0-flash",
//       contents,
//       config: { systemInstruction: system_prompt },
//     });

//     const rawText = await result.text;
//     // const cleanedText = cleanMarkdown(rawText);

//     return rawText;

//   } catch (err) {
//     console.error("❌ Gemini extraction failed:", err);
//     return "⚠️ Failed to extract arguments from file.";
//   }
// }

async function extractArgumentsFromFile(filePath) {
  console.log("📄 Extracting arguments from:", filePath);

  try {
    const buffer = await fs.readFile(filePath);
    const data = await pdfParse(buffer);
    const pdfText = data.text;

    const contents = [
      { role: "user", parts: [{text: prompt}] },
      { role: "user", parts: [{text:pdfText}] },
    ];

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents,
      config:{
        systemInstruction:system_prompt,
        temperature: 0.4,
        topK: 40,
        topP: 0.85,
        maxOutputTokens: 3500,
        thinkingConfig:{
          thinkingBudget:0
        }
      }
     
    });

    return await result.text;

  } catch (err) {
    console.error("❌ Gemini extraction failed:", err);
    return "⚠️ Failed to extract arguments from file.";
  }
}
async function humanizeStructuredArguments(extractedArguments) {
  const contents = [
    {
      role: "user",
      parts: [{ text: "Humanize these arguments." }]
    },
    {
      role: "user",
      parts: [{ text: extractedArguments }]
    }
  ];

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config: {
        systemInstruction: criticalVoicePrompt,
        temperature:0.95,
        topP:0.9,
        topK:50,
        presencePenalty: 0.8,
        frequencyPenalty: 0.5,
        thinkingConfig:{
          thinkingBudget:0
        }
      }
    });

    const response = await result.text;
    return response;

  } catch (error) {
    console.error("❌ Gemini humanization failed:", error);
    return "⚠️ Failed to humanize structured arguments.";
  }
}


module.exports = { extractArgumentsFromFile,
  humanizeStructuredArguments
 };
