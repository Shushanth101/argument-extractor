const { Worker } = require('bullmq');
const { connection } = require('./producer');
const { extractArgumentsFromFile, humanizeStructuredArguments } = require('./gemini');
const { saveToDrive } = require('./drive');
const fs = require('fs');
const path = require('path');

const FOLDER_ID_1 = process.env.FOLDER_ID_1;
const FOLDER_ID_2 = process.env.FOLDER_ID_2;


const worker = new Worker('file-queue', async (job) => {
  const { filePath, fileName } = job.data;

  console.log(`📥 Processing ${fileName}`);

  try {
  const extractedArguments = await extractArgumentsFromFile(filePath);
const baseName = `${path.parse(fileName).name} - Extracted Arguments`;
  await saveToDrive(extractedArguments, baseName,FOLDER_ID_1);
  const humanizedOutput = await humanizeStructuredArguments(extractedArguments);
  const baseName1 = `${path.parse(fileName).name} - Narrative Arguments`;
  await saveToDrive(humanizedOutput,baseName1,FOLDER_ID_2)


  fs.unlinkSync(filePath);

  console.log(`✅ Completed ${fileName}`);
}catch (error) {
    console.error(`❌ Failed processing ${fileName}:`, error);
    throw error;
  }
}, { connection });


worker.on('completed', (job) => {
  console.log(`🎉 Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`💥 Job ${job.id} failed:`, err.message);
});
