const express = require('express');
const multer = require('multer');
const { fileQueue } = require('./producer');
const path = require('path');
const {saveToDrive,listFilesInFolder} = require('./drive');
const {listFilesRouter} = require('./routes/listFiles')
const cors = require("cors");
const { exec } = require("child_process");
require('dotenv').config()



const app = express();
app.use(cors());

const PORT = 5000;

const FOLDER_ID_1 =  process.env.FOLDER_ID_1;
const FOLDER_ID_2 =  process.env.FOLDER_ID_2;

exec(
  "docker run -d --name redis-bullmq -p 6379:6379 redis",
  (err, stdout, stderr) => {
    if (err) {
      if (stderr.includes("Conflict")) {
        console.log("⚠️ Redis container already exists. Starting it...");
        // Try to start it if already created
        exec("docker start redis-bullmq", (err2, out2, errOut2) => {
          if (err2) {
            console.error("❌ Failed to start existing Redis container:", errOut2);
            return;
          }
          console.log("✅ Existing Redis container started.");
          launchConsumer();
        });
      } else {
        console.error("❌ Docker run error:", stderr);
      }
    } else {
      console.log("✅ Redis container started:", stdout.trim());
      launchConsumer();
    }
  }
);

function launchConsumer() {
  console.log("🚀 Launching consumer.js...");
  const sub = exec("node consumer.js");
  sub.stdout.on("data", (data) => console.log(data.toString()));
  sub.stderr.on("data", (data) => console.error(data.toString()));
}

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.array('files', 100), async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    
    for (const file of files) {
      await fileQueue.add('processFile', {
        filePath: path.resolve(file.path),
        fileName: file.originalname,
      });
    }
    console.log("files added to que")

    res.json({ message: 'Files queued for processing', count: files.length });
  } catch (err) {
    console.error('❌ Upload failed:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

app.use("/list-files",listFilesRouter);



app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
