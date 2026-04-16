# Platform Engineering Learning Scope & Lesson Plan
**Student:** Kareem Rufai  
**GitHub:** yemyy27  
**Started:** April 15, 2026  
**Goal:** Interview-ready AI Platform Engineer  
**Stack:** Anthropic API, Google Cloud Platform, Python, Docker, Kubernetes

---

## TRACK 1 — SHORT TERM (4-8 Weeks)
### Goal: Interview ready, portfolio built, story to tell

---

### WEEK 1 — GenAI Foundations
**Status:** 🟡 In Progress  
**Goal:** Build mental model of LLMs, tokens, transformers

#### Lessons
- Lesson 1: How LLMs work — token prediction, autoregressive generation
- Lesson 2: Tokens — what they are, why they matter for cost
- Lesson 3: Transformers and attention mechanism
- Lesson 4: Temperature, Top-P, System Prompts
- Lesson 5: Prompt Engineering — Zero-shot, Few-shot, Chain of thought

#### Deliverables
- [ ] genai-foundations.md notes completed
- [ ] Able to explain LLMs, tokens, attention in an interview
- [ ] Able to answer: temperature, top-p, system prompt questions

#### Interview Questions Covered
- What is a transformer?
- How do LLMs generate text?
- What are tokens and why do they matter?
- What does temperature control?
- What is the difference between fine-tuning and prompting?

---

### WEEK 2 — Building with LLM APIs
**Status:** ⬜ Not Started  
**Goal:** Build and deploy first real AI application

#### Lessons
- Lesson 1: Gemini API setup and first API call
- Lesson 2: Streaming responses
- Lesson 3: System prompts and conversation memory
- Lesson 4: Function calling / tool use
- Lesson 5: Structured output parsing (JSON mode)
- Lesson 6: Building against multiple providers

#### Deliverables
- [ ] First Python script calling Gemini API
- [ ] Chatbot with streaming, system prompt, memory
- [ ] Function calling implementation
- [ ] JSON structured output implementation
- [ ] Deployed FastAPI + Docker container
- [ ] Code pushed to GitHub week2 folder

#### Interview Questions Covered
- How does streaming work in LLM APIs?
- What is function calling and when would you use it?
- How do you handle conversation memory?

---

### WEEK 3 — LangChain, LangGraph & Agents
**Status:** ⬜ Not Started  
**Goal:** Build a working AI agent

#### Lessons
- Lesson 1: LangChain fundamentals
- Lesson 2: LangGraph introduction
- Lesson 3: The 4 agentic patterns
- Lesson 4: Building a multi-step agent
- Lesson 5: Human-in-the-loop

#### Deliverables
- [ ] LangChain Academy Introduction to LangGraph completed
- [ ] Multi-step agent with web search + custom tool
- [ ] Human-in-the-loop approval gates
- [ ] Agent pushed to GitHub with clear README

#### Interview Questions Covered
- What is an AI agent?
- What are the 4 agentic patterns?
- How does LangGraph work?
- When would you use human-in-the-loop?

---

### WEEK 4 — RAG Pipeline
**Status:** ⬜ Not Started  
**Goal:** Build and evaluate a production RAG system

#### Lessons
- Lesson 1: What is RAG and why it exists
- Lesson 2: Document chunking strategies
- Lesson 3: Embeddings and vector stores
- Lesson 4: Retrieval and generation
- Lesson 5: Evaluating RAG with RAGAS
- Lesson 6: Hybrid search

#### Deliverables
- [ ] End-to-end RAG pipeline built
- [ ] RAGAS evaluation implemented
- [ ] Hybrid search implemented
- [ ] Entire pipeline containerized with Docker

#### Interview Questions Covered
- What is RAG and why use it over fine-tuning?
- What are chunking strategies?
- How do you evaluate RAG quality?
- What is hybrid search?

---

### WEEK 5 — Multi-Agent Systems
**Status:** ⬜ Not Started  
**Goal:** Build a multi-agent team

#### Lessons
- Lesson 1: Multi-agent architecture patterns
- Lesson 2: CrewAI fundamentals
- Lesson 3: LangGraph vs CrewAI vs AutoGen
- Lesson 4: MCP - Model Context Protocol
- Lesson 5: Agent-to-enterprise communication

#### Deliverables
- [ ] CrewAI team built (researcher + writer + reviewer)
- [ ] Same workflow rebuilt in LangGraph
- [ ] Framework comparison document
- [ ] Code pushed to GitHub

#### Interview Questions Covered
- When would you use multi-agent vs single agent?
- What is MCP and why does it matter?
- Compare LangGraph vs CrewAI vs AutoGen

---

### WEEK 6 — Observability & Guardrails
**Status:** ⬜ Not Started  
**Goal:** Make AI systems production safe and observable

#### Lessons
- Lesson 1: Why observability matters for AI
- Lesson 2: Langfuse setup and instrumentation
- Lesson 3: NeMo Guardrails
- Lesson 4: OWASP Top 10 for LLMs
- Lesson 5: Hallucination detection

#### Deliverables
- [ ] Langfuse self-hosted via Docker
- [ ] RAG or agent app fully instrumented
- [ ] Guardrails implemented
- [ ] OWASP Top 10 studied and documented

#### Interview Questions Covered
- How do you monitor an LLM in production?
- What is prompt injection and how do you prevent it?
- How do you detect hallucinations?

---

### WEEK 7 — AI + DevOps: The Platform Story
**Status:** ⬜ Not Started  
**Goal:** Connect AI to DevOps — your differentiator

#### Lessons
- Lesson 1: Containerizing AI applications
- Lesson 2: GitHub Actions for AI apps
- Lesson 3: Kubernetes deployment
- Lesson 4: GitOps with ArgoCD
- Lesson 5: The AI + DevOps story

#### Deliverables
- [ ] Best project fully containerized
- [ ] GitHub Actions pipeline with DeepEval tests
- [ ] Deployed to Kubernetes (Kind cluster)
- [ ] ArgoCD GitOps setup
- [ ] Full story documented in README

#### Interview Questions Covered
- How do you deploy an AI application to Kubernetes?
- What is GitOps and how does it apply to AI?
- How do you run LLM evaluation in CI/CD?

---

## TRACK 2 — LONG TERM (3-12 Months)
### Goal: Deep expertise, senior level platform engineer

---

### MONTHS 1-2 — Kubernetes Mastery
- [ ] CKA certification
- [ ] Multi-service deployment on Kind cluster
- [ ] CKAD next milestone

### MONTHS 2-3 — IaC, SRE & GitOps
- [ ] Terraform Associate certification
- [ ] Google SRE Book completed
- [ ] ArgoCD blue/green deployments

### MONTHS 3-5 — Cloud AI Platforms & GPU
- [ ] GCP Professional ML Engineer certification
- [ ] Vertex AI deployment
- [ ] GPU Operator on Kubernetes

### MONTHS 5-7 — Model Serving & Fine-Tuning
- [ ] vLLM local deployment
- [ ] QLoRA fine-tuning
- [ ] MLflow experiment tracking

### MONTHS 5-8 — MLOps Lifecycle
- [ ] Kubeflow pipeline
- [ ] KServe deployment
- [ ] Ray distributed training

### MONTHS 8-12 — Production Observability
- [ ] Production Grafana dashboards
- [ ] Evidently drift detection
- [ ] Advanced NeMo Guardrails

---

## CERTIFICATION ROADMAP

| Timeline | Certification | Status |
|----------|--------------|--------|
| Months 1-2 | CKA - Certified Kubernetes Administrator | ⬜ |
| Months 1-2 | HashiCorp Terraform Associate | ⬜ |
| Months 4-6 | Google Professional ML Engineer | ⬜ |
| Months 4-6 | CKAD | ⬜ |
| Months 7-9 | NVIDIA AI Infrastructure Associate | ⬜ |
| Months 7-9 | CKS | ⬜ |
| Months 10-12 | CNPA | ⬜ |
| Months 10-12 | Google Professional Cloud DevOps Engineer | ⬜ |

---

## PORTFOLIO PROJECTS

| Project | Week | Status | GitHub |
|---------|------|--------|--------|
| GenAI Foundations Notes | Week 1 | 🟡 In Progress | week1/ |
| Gemini API Chatbot | Week 2 | ⬜ | week2/ |
| LangGraph Agent | Week 3 | ⬜ | week3/ |
| RAG Pipeline | Week 4 | ⬜ | week4/ |
| Multi-Agent System | Week 5 | ⬜ | week5/ |
| Observable AI App | Week 6 | ⬜ | week6/ |
| AI + DevOps Pipeline | Week 7 | ⬜ | week7/ |

---

## DAILY WORKFLOW
```bash
# Start of every session
cd ~/platform-engineering
git pull origin main

# End of every session
git add .
git commit -m "describe what you did"
git push origin main
```

---

## TOOLS & STACK
| Tool | Purpose | Status |
|------|---------|--------|
| Python 3.11 | Primary language | ✅ Installed |
| Docker | Containerization | ✅ Installed |
| VS Code | Code editor | ✅ Installed |
| Git + GitHub | Version control | ✅ Configured |
| Google Cloud CLI | GCP management | ✅ Configured |
| Gemini API | LLM API (free) | ✅ Configured |
| Node.js | Supporting tools | ✅ Installed |
| Homebrew | Package manager | ✅ Installed |
| Anthropic API | LLM API | ⬜ Pending credits |
| LangChain | Agent framework | ⬜ Week 3 |
| Docker Compose | Multi-container | ⬜ Week 4 |
| Kubernetes | Orchestration | ⬜ Week 7 |
| ArgoCD | GitOps | ⬜ Week 7 |
| Langfuse | Observability | ⬜ Week 6 |