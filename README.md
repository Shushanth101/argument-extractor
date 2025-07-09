# 🧠 Argument Extractor Web App

A full-stack AI-powered document processing tool to extract and humanize arguments from multiple PDF files.

---

## ⚙️ Features

- 📂 **Upload Multiple Files**: Drag and drop or select multiple files in the left panel.
- 🧵 **Queue-based Processing**: Files are pushed to a Redis-backed queue and processed asynchronously.
- 🧠 **Argument Extraction**: Extracts raw arguments using Gemini-based NLP from each PDF.
- 💬 **Humanization**: Converts raw arguments into human-friendly, natural language summaries.
- ☁️ **Google Drive Integration**: Both raw and humanized arguments are saved to separate folders in your Google Drive.
- 🔗 **Link Display Panel**: Right-side panel dynamically displays links to saved argument files:
  - **Raw Arguments**
  - **Humanized Arguments**

---

## 🖼️ UI Overview

![Screenshot 2025-07-09 211120](https://github.com/user-attachments/assets/b46bf8d4-b5a1-488a-8a79-f4331a8c7fb2)

---

## 🚀 Getting Started

### 1️⃣ Clone the repository


`git clone https://github.com/Shushanth101/argument-extractor.git`


`cd argument-extractor`



### 2️⃣ Install redis via docker

`docker run -d --name redis-bullmq -p 6379:6379 redis:5.0.14`


⚠️ Redis version 5.0.14 or higher is required.


### 3️⃣ Install Dependencies

`cd backend`
`npm install`

`cd ../frontend`
`npm install `

### 4️⃣ Start Dev Servers

# Terminal 1

`cd backend`


`npm run dev`

# Terminal 2

`cd frontend`


`npm run dev`


### The Workflow
![Screenshot 2025-07-08 132415](https://github.com/user-attachments/assets/dc64902f-2e1a-4492-8802-72c428f8c2e5)

