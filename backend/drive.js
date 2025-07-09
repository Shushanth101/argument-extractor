const { drive, docs } = require('./google');
require('dotenv').config()



/**
 * Save content as a new Google Doc and move it to the target folder
 */
async function saveToDrive(content, fileName,FOLDER_ID) {
  try {
    // Step 1: Create a new Google Doc
    const createRes = await docs.documents.create({
      requestBody: {
        title: fileName,
      },
    });

    const docId = createRes.data.documentId;

    // Step 2: Write content into the Google Doc
    await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: {
        requests: [
          {
            insertText: {
              text: content,
              location: {
                index: 1,
              },
            },
          },
        ],
      },
    });

   
    const file = await drive.files.get({
      fileId: docId,
      fields: 'parents',
    });

    const previousParents = file.data.parents.join(',');

    await drive.files.update({
      fileId: docId,
      addParents: FOLDER_ID,
      removeParents: previousParents,
      fields: 'id, parents',
    });

    console.log(`✅ Saved "${fileName}" to Drive`);
    return docId;

  } catch (err) {
    console.error("❌ Failed to save to Drive:", err.message);
    throw err;
  }
}

/**
 * List all files in a given folder
 */
async function listFilesInFolder(folderId) {
  try {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, webViewLink)',
    });

    return res.data.files;
  } catch (err) {
    console.error('❌ Failed to list files:', err.message);
    return [];
  }
}

module.exports = {
  saveToDrive,
  listFilesInFolder,
};
