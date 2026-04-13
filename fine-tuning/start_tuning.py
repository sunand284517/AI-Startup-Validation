import os
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load API key from the backend .env file
load_dotenv(dotenv_path="../backend/.env")

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY not found in ../backend/.env")
    exit(1)

# Initialize the Gemini Client
client = genai.Client(api_key=api_key)

def create_tuning_job():
    try:
        print("1. Uploading training dataset...")
        # Upload the JSONL file to Gemini's storage
        uploaded_file = client.files.upload(
            file="dataset.jsonl",
            config={'display_name': 'Startup Validation Dataset'}
        )
        print(f"File uploaded successfully! URI: {uploaded_file.uri}")

        print("\n2. Starting Fine-Tuning Job (this may take a while)...")
        # Initialize the tuning job using a supported base model
        tuning_job = client.tunings.tune(
            base_model="models/gemini-1.5-flash-001-tuning",
            training_dataset=uploaded_file,
            config=types.TuningConfig(
                display_name="Startup-Validator-Tuned",
                epoch_count=5, # Number of passes over the dataset
                batch_size=4,
                learning_rate_multiplier=1.0
            )
        )

        print("\nTuning job initialized!")
        print(f"Job / Model ID: {tuning_job.name}")
        print("State: Pending/Running")
        print("-" * 40)
        print("You can monitor the tuning progress in your Google AI Studio dashboard.")
        print("Once complete, copy the newly tuned model name (e.g., 'tunedModels/startup-validator...')")
        print("Then put that model name into your frontend/.env file as:")
        print("VITE_GEMINI_MODEL=tunedModels/YOUR_TUNED_MODEL_ID")

    except Exception as e:
        print("\nError creating tuning job:")
        print(e)

if __name__ == "__main__":
    create_tuning_job()