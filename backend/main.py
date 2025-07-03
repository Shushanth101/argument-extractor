from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Set up FastAPI app
app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust if your frontend is hosted elsewhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini client
# Initialize Gemini client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Optional system prompt (you can define system_prompt in system_prompt.py if needed)
try:
    from system_prompt import system_prompt
    config = types.GenerateContentConfig(system_instruction=system_prompt)
except ImportError:
    config = None

# Route: Extract arguments using Gemini
@app.post("/extract")
async def extract(document: UploadFile = File(...)):
    content = await document.read()
    prompt = """
    Extract and format the core argumentative structure of the following document 
    """
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        config=config,
        contents=[
            types.Part.from_bytes(
                data=content,
                mime_type=document.content_type,
            ),
            prompt
        ]
    )

    return {"arguments": response.text}


# Google Docs setup
SCOPES = ['https://www.googleapis.com/auth/documents', 'https://www.googleapis.com/auth/drive.file']

class TextRequest(BaseModel):
    text: str


def get_docs_service():
    creds = None
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    else:
        flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
        creds = flow.run_local_server(port=0)
        with open("token.json", "w") as token_file:
            token_file.write(creds.to_json())

    return build("docs", "v1", credentials=creds)

# Route: Save to Google Docs
@app.post("/save-doc")
def save_to_docs(req: TextRequest):
    service = get_docs_service()


  # Create a new Google Doc
    doc = service.documents().create(body={"title": "Extracted Arguments"}).execute()
    doc_id = doc.get("documentId")

    # Insert text into the document
    service.documents().batchUpdate(
        documentId=doc_id,
        body={
            "requests": [
                {
                    "insertText": {
                        "location": {"index": 1},
                        "text": req.text
                    }
                }
            ]
        }
    ).execute()

    return {
        "message": "Document created successfully",
        "doc_link": f"https://docs.google.com/document/d/{doc_id}/edit"
    }

