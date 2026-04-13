# 🚀 IdeaSpark: AI Startup Validation Platform

IdeaSpark is a MERN-stack platform designed for student founders and entrepreneurs to pitch, validate, and gather community feedback on their startup ideas. It leverages **Google's Gemini AI** to provide instant, structured evaluations (quality scoring, actionable feedback, and spam detection) before an idea even reaches the community feed.

## 🛠️ Architecture & Tech Stack

This project was recently restructured from a Firebase/TypeScript MVP into a full **MERN** application with a dedicated AI fine-tuning pipeline.

*   **Frontend**: React, Vite, JavaScript (`.jsx`), Tailwind CSS, `shadcn/ui`, Axios.
*   **Backend**: Node.js, Express, MongoDB (Mongoose), JSON Web Tokens (JWT).
*   **AI Integration**: Google Gen AI SDK (`gemini-3-flash-preview`).
*   **Fine-Tuning**: Python (`google-genai` SDK) for custom model training.

## 📁 Project Structure

```text
/
├── backend/            # Express.js REST API & MongoDB Data Models
│   ├── models/         # Mongoose schemas (Idea.js, User.js)
│   ├── server.js       # Main server entry point & API routes
│   └── package.json
├── frontend/           # React + Vite Client Application
│   ├── src/            # UI Components, Pages, and Contexts
│   ├── vite.config.js
│   └── package.json
└── fine-tuning/        # Python AI Fine-Tuning Pipeline
    ├── dataset.jsonl   # Training data examples (Title, Problem, Solution -> Feedback)
    ├── start_tuning.py # Script to upload data and train the Gemini model
    └── requirements.txt
```

## ✨ Key Features

*   **⚡ AI-Powered Pitch Validation:** Evaluates early-stage ideas for viability, gives them a quality score, and auto-categorizes them using Gemini.
*   **📊 Community Validation:** Fellow founders can upvote concepts via Polls, and provide structured 5-star ratings and written feedback.
*   **🤝 Team Building:** "Apply to join" functionality allows users to send applications to idea owners.
*   **⏱️ Productivity Timers:** Built-in "Founder Sessions" enforcing a 15-minute active work block followed by a cooldown to promote deep work.
*   **🧠 Custom LLM Tuning ready:** Built-in Python scripts to easily train a highly specialized Startup-Evaluating Gemini model using your own data.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB running locally on port `27017` (or modify the `.env` to point to MongoDB Atlas)
*   Python 3.10+ (If you plan to fine-tune the AI)

### 1. Start the Backend API
```bash
cd backend
npm install

# Create a .env file with:
# MONGO_URI=mongodb://localhost:27017/ideaspark
# PORT=5000
# JWT_SECRET=supersecret

npm start
# Server runs on http://localhost:5000
```

### 2. Start the Frontend Client
Open a new terminal window:
```bash
cd frontend
npm install

# Create a .env file linking to your Gemini API key:
# VITE_GEMINI_API_KEY=your_google_ai_studio_key
# VITE_GEMINI_MODEL=gemini-3-flash-preview  # (Optional: Override with tuned model)

npm run dev
# App runs on http://localhost:3000
```

---

## 🧠 How to Fine-Tune the AI Model

Want the evaluator to be a harsher critic or focus purely on SaaS viability? You can train the AI to your specific tastes.

1.  Navigate to the `fine-tuning/` directory.
2.  Install dependencies: `pip install -r requirements.txt`.
3.  Add **at least 100+ high-quality examples** to the `dataset.jsonl` file. Make sure you strictly follow the system prompt formatting.
4.  Run the training script:
    ```bash
    python start_tuning.py
    ```
5.  Wait for Google to complete the training in your AI Studio dashboard.
6.  Once finished, the script/dashboard will provide your tuned model ID (e.g., `tunedModels/startup-validator-xyz`).
7.  Add that ID to your `frontend/.env` file:
    ```env
    VITE_GEMINI_MODEL=tunedModels/startup-validator-xyz
    ```
    Your React app will now instantly utilize your specialized AI model!

## 📜 License

MIT License. Feel free to use this as a boilerplate for your next big thing.