# AI Portfolio Copilot

An elegant, client-facing developer portfolio powered by an AI Copilot. Grounded strictly in the resume details of **Shubh Shaguneet Singh** (Computer Science undergraduate at BITS Pilani Goa Campus), this portfolio features a modern glassmorphic interface and an interactive RAG (Retrieval-Augmented Generation) assistant.

---

## 🚀 Technology Stack

- **Frontend Framework:** Next.js (App Router, React 19, JavaScript)
- **Styling:** Vanilla CSS (Global variables, glassmorphic layout grids, scroll reveal observers, and micro-animations)
- **Backend API Layer:** Next.js Route Handlers running on Node.js
- **AI Integrations:** 
  - Google Gemini API (via `@google/generative-ai` SDK) - *Primary*
  - OpenAI API (via `openai` SDK) - *Secondary*
- **Grounding Context:** Structured Markdown (`src/data/resume.md`) and JSON (`src/data/resume.json`)

---

## 📐 Architecture & RAG Pipeline Design

The application operates in two modes to guarantee a functional user experience under all conditions:

### 1. Advanced RAG Mode (API Key Supplied)
When a Gemini or OpenAI API key is supplied (configured via `.env.local` on the backend, or entered in the chat widget Settings panel), the system initiates a client-server RAG pipeline:
```
[User Question] ──> [Next.js Route Handler (/api/chat)]
                           │
                           ├──> Read "src/data/resume.md" Context
                           ├──> Inject Strict Grounding System Prompt
                           └──> Call LLM (Gemini or OpenAI)
                                     │
[Grounded Answer] <──────────────────┘
```

**System Prompt Grounding Directives:**
- Rely strictly on the injected `resume.md` context.
- Never hallucinate or extrapolate facts.
- Reject out-of-context questions (e.g. "What is Shubh's favorite food?") and output a polite fallback statement redirecting to Shubh's contact details.

### 2. Intelligent Offline Fallback Mode (No API Key)
To enable immediate evaluation without requiring credentials, the Copilot includes a custom keyword-matching search engine. It tokenizes queries and maps them against sections in `resume.json`. If a query falls outside the resume's scope, it refuses to answer and redirects to Shubh's contact info.

---

## 📂 Project Structure

```
ai-portfolio-copilot/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.js    # Node.js API Route Handler for RAG grounding
│   │   ├── globals.css         # Premium glassmorphic CSS styling & variables
│   │   ├── layout.js           # SEO Metadata & Font loaders
│   │   └── page.js             # Portfolio home view (About, Skills, Projects, Timelines)
│   ├── components/
│   │   └── CopilotChat.js      # Floating chat interface, suggestion chips, settings & fallback
│   └── data/
│       ├── resume.json         # Structured data for offline matching
│       └── resume.md           # Markdown data for RAG context
├── tests.json                  # Grounding test suite (10 Q&A pairs)
├── verify-grounding.js         # Automated test runner script
├── package.json
└── jsconfig.json
```

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js:** version v24.16.0 or higher
- **npm:** version 11.13.0 or higher

### 1. Environment Setup
To configure the backend LLM, create a `.env.local` file in the root directory:
```bash
# To use Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# To use OpenAI API
OPENAI_API_KEY=your_openai_api_key_here
```
*(Alternatively, you can toggle the settings gear inside the chat widget UI to test custom API keys directly in the browser. They will be stored in your browser's `localStorage`.)*

### 2. Run the Development Server
```bash
# Update path to include Node.js if necessary, then start
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 🧪 Grounding Verification Testing

The project includes an automated test runner to validate that responses do not hallucinate and are strictly grounded in Shubh's data.

To execute the 10 test cases in `tests.json`:
```bash
node verify-grounding.js
```

### Sample Q&A Pairs Formulated for Verification

| ID | Test Question | Type | Expected Key Grounding References |
|----|---------------|------|-----------------------------------|
| 1 | Where does Shubh study? | Factual | BITS Pilani, Goa Campus, Computer Science |
| 2 | What is Shubh's CGPA? | Factual | 8.00, CGPA |
| 3 | Tell me about the GNSS Receiver project. | Project | GNSS, government-sponsored, Python, satellite |
| 4 | What tools and frameworks does Shubh know? | Skills | Flutter, MySQL, Excel, Word, Canva |
| 5 | What languages does Shubh code in? | Skills | C++, Java, Python, C |
| 6 | Tell me about the Backstage Inventory app. | Project | Flutter, inventory, auditorium, spreadsheets |
| 7 | What was Shubh's role in Quark? | Extracurricular | Quark Coordinator, Backstage, stage setups |
| 8 | What is Shubh's phone number and email? | Personal | +91 8146049603, shubhshaguneet635@gmail.com |
| 9 | What was Shubh's percentage in Class XII? | Factual | 92.5%, Sudesh Vatika Convent School |
| 10 | What is Shubh's favorite food? | Hallucination | Refuses to answer (directs to email/phone) |

---

## 🧠 Challenges & Solutions

1. **Keyword Collision in Fallback Matching:**
   * *Problem:* A query like *"What frameworks does Shubh know?"* was incorrectly routed to Projects because the word "framework" contains the substring "work" (which was matched for project checks).
   * *Solution:* Adjusted checking precedence to evaluate Skills and Tools first before checking project keywords.

2. **Grounded Generation Consistency:**
   * *Problem:* Standard LLM configurations can introduce fluff or assume details not in the text.
   * *Solution:* We set LLM generation temperature to `0.1` and added strict negative constraints in the system prompt: *"Answer ONLY using the provided profile. If it is not present, respond with the fallback message. Do not assume or extrapolate."*

---

## 🗺️ Future Roadmap

1. **Vector Embeddings (Dense Retrieval):** Transition from simple markdown injection to dense embeddings using ChromaDB or Pinecone if the resume context exceeds prompt limits.
2. **Interactive Terminal Interface:** Expose the grounding test suite as a web console dashboard to view test passes and failures in real-time.
3. **Interactive Project Demos:** Integrate interactive widgets for projects (e.g. mock DB querying or signal processing sliders).
