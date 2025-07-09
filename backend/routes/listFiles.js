const { Router } = require('express');
const router = Router();

const { listFilesInFolder } = require('../drive'); // Assuming it's imported here

const FOLDER_ID_1 = `1NATdLmi58PXi3hONBbFHpLY_PFgk3tij`; // Extracted
const FOLDER_ID_2 = `1r3SB-exAfSegfK3nFnRWz2wYezrjiQ8K`; // Narrative

router.get('/narrative-arguments', async (req, res) => {
  try {
    const files = await listFilesInFolder(FOLDER_ID_2);
    res.json(files);
  } catch (error) {
    console.error("❌ Error listing files (narrative):", error);
    res.status(500).json({ error: "Failed to list narrative files" });
  }
});

router.get('/extracted-arguments', async (req, res) => {
  try {
    const files = await listFilesInFolder(FOLDER_ID_1);
    res.json(files);
  } catch (error) {
    console.error("❌ Error listing files (extracted):", error);
    res.status(500).json({ error: "Failed to list extracted files" });
  }
});

module.exports = {
  listFilesRouter: router
};
