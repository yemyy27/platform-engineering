const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageNumber, TabStopType, TabStopPosition
} = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const headerBorder = { style: BorderStyle.SINGLE, size: 1, color: "1E3A5F" };
const headerBorders = { top: headerBorder, bottom: headerBorder, left: headerBorder, right: headerBorder };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, bold: true, size: 32, font: "Arial" })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true, size: 26, font: "Arial" })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, bold: true, size: 24, font: "Arial", color: "1E3A5F" })]
  });
}

function p(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, font: "Arial" })],
    spacing: { after: 120 }
  });
}

function bullet(text, bold_part, rest) {
  const children = bold_part
    ? [new TextRun({ text: bold_part, bold: true, size: 22, font: "Arial" }), new TextRun({ text: rest || "", size: 22, font: "Arial" })]
    : [new TextRun({ text, size: 22, font: "Arial" })];
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    children,
    spacing: { after: 60 }
  });
}

function codeBlock(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: "Courier New", size: 18, color: "1E3A5F" })],
    indent: { left: 720 },
    spacing: { before: 60, after: 60 },
    border: { left: { style: BorderStyle.SINGLE, size: 4, color: "4A90D9", space: 8 } }
  });
}

function spacer() {
  return new Paragraph({ children: [new TextRun("")], spacing: { after: 120 } });
}

function divider() {
  return new Paragraph({
    children: [new TextRun("")],
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "1E3A5F", space: 1 } },
    spacing: { before: 120, after: 200 }
  });
}

function termRow(term, definition, shade) {
  const fill = shade ? "EEF4FB" : "FFFFFF";
  return new TableRow({
    children: [
      new TableCell({
        borders, width: { size: 2800, type: WidthType.DXA },
        shading: { fill, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: term, bold: true, size: 20, font: "Arial" })] })]
      }),
      new TableCell({
        borders, width: { size: 6560, type: WidthType.DXA },
        shading: { fill, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: definition, size: 20, font: "Arial" })] })]
      })
    ]
  });
}

function tableHeader(col1, col2) {
  return new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        borders: headerBorders, width: { size: 2800, type: WidthType.DXA },
        shading: { fill: "1E3A5F", type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: col1, bold: true, size: 20, font: "Arial", color: "FFFFFF" })] })]
      }),
      new TableCell({
        borders: headerBorders, width: { size: 6560, type: WidthType.DXA },
        shading: { fill: "1E3A5F", type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: col2, bold: true, size: 20, font: "Arial", color: "FFFFFF" })] })]
      })
    ]
  });
}

function termTable(rows) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 6560],
    rows: [
      tableHeader("Term", "Definition"),
      ...rows.map((r, i) => termRow(r[0], r[1], i % 2 === 0))
    ]
  });
}

function bashRow(cmd, desc, shade) {
  const fill = shade ? "F0F4F0" : "FFFFFF";
  return new TableRow({
    children: [
      new TableCell({
        borders, width: { size: 3200, type: WidthType.DXA },
        shading: { fill, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: cmd, font: "Courier New", size: 18, color: "1E5C1E" })] })]
      }),
      new TableCell({
        borders, width: { size: 6160, type: WidthType.DXA },
        shading: { fill, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: desc, size: 20, font: "Arial" })] })]
      })
    ]
  });
}

function bashTable(rows) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3200, 6160],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            borders: headerBorders, width: { size: 3200, type: WidthType.DXA },
            shading: { fill: "1E5C1E", type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: "Command", bold: true, size: 20, font: "Arial", color: "FFFFFF" })] })]
          }),
          new TableCell({
            borders: headerBorders, width: { size: 6160, type: WidthType.DXA },
            shading: { fill: "1E5C1E", type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: "What it does", bold: true, size: 20, font: "Arial", color: "FFFFFF" })] })]
          })
        ]
      }),
      ...rows.map((r, i) => bashRow(r[0], r[1], i % 2 === 0))
    ]
  });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: "1E3A5F" },
        paragraph: { spacing: { before: 360, after: 240 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "1E3A5F" },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "2E6DA4" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [

      // ── TITLE BLOCK ──────────────────────────────────────────────────────
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Platform Engineering Learning Journey", bold: true, size: 52, font: "Arial", color: "1E3A5F" })],
        spacing: { before: 480, after: 120 }
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "AI Era Foundations — Reference README", size: 28, font: "Arial", color: "555555" })],
        spacing: { after: 120 }
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Student: Kareem Rufai  |  GitHub: yemyy27  |  Stack: Python 3.11 · GCP · Gemini API · Docker · macOS M1", size: 20, font: "Arial", color: "888888" })],
        spacing: { after: 480 }
      }),
      divider(),

      // ── 1. PROJECT OVERVIEW ──────────────────────────────────────────────
      h1("1. Project Overview"),
      p("This repository documents a structured, hands-on journey into AI Platform Engineering — the discipline of building, deploying, observing, and operating AI-powered applications on cloud-native infrastructure. The curriculum follows a short-term track (4–8 weeks, interview-ready) and a long-term track (3–12 months, deep expertise)."),
      p("Every session produces working code committed to GitHub. This README serves as a living reference — a single document covering every tool, term, bash command, and concept encountered throughout the learning path."),
      spacer(),

      // ── 2. REPO STRUCTURE ────────────────────────────────────────────────
      h1("2. Repository Structure"),
      codeBlock("platform-engineering/"),
      codeBlock("  week1/               # GenAI Foundations + first Gemini API scripts"),
      codeBlock("  week2/               # LLM APIs, streaming, FastAPI, Docker"),
      codeBlock("  week3/               # LangChain, LangGraph, Agents"),
      codeBlock("  week4/               # RAG Pipelines, Vector DBs, RAGAS evaluation"),
      codeBlock("  week5/               # Multi-Agent Systems, CrewAI, MCP"),
      codeBlock("  week6/               # Observability, Guardrails, Langfuse"),
      codeBlock("  week7/               # CI/CD, GitOps, ArgoCD, Kubernetes"),
      codeBlock("  documentation.md     # All bash commands used in the project"),
      codeBlock("  scope-and-lessons.md # Full curriculum scope and lesson plan"),
      codeBlock("  README.md            # This file"),
      spacer(),

      // ── 3. DAILY WORKFLOW ────────────────────────────────────────────────
      h1("3. Daily Workflow — Git Commands"),
      p("Every session starts and ends with Git. This is non-negotiable in professional platform engineering — Git is the source of truth for everything."),
      spacer(),
      bashTable([
        ["git pull origin main", "Sync latest changes from GitHub before starting work"],
        ["git checkout -b day5-agent", "Create and switch to a new feature branch"],
        ["git checkout main", "Switch back to the main branch"],
        ["git status", "See which files have changed"],
        ["git add .", "Stage all changed files for commit"],
        ["git add week1/day5-agent.py", "Stage a specific file only"],
        ["git commit -m \"message\"", "Save staged changes with a descriptive message"],
        ["git push origin main", "Push commits to GitHub (main branch)"],
        ["git push origin day5-agent", "Push a feature branch to GitHub"],
        ["git merge day5-agent", "Merge a branch into the current branch"],
        ["git log --oneline", "See compact commit history"],
        ["git diff", "See unstaged changes line by line"],
        ["git branch", "List all local branches"],
        ["git branch -d branch-name", "Delete a local branch after merging"],
      ]),
      spacer(),

      // ── 4. ENVIRONMENT SETUP ─────────────────────────────────────────────
      h1("4. Environment Setup Commands"),
      h3("Homebrew (macOS package manager)"),
      bashTable([
        ["brew install python@3.11", "Install Python 3.11 via Homebrew"],
        ["brew install node", "Install Node.js"],
        ["brew install --cask google-cloud-sdk", "Install Google Cloud CLI"],
        ["brew --version", "Verify Homebrew is installed"],
        ["source ~/.zprofile", "Reload shell profile after editing PATH"],
      ]),
      spacer(),
      h3("Python & pip"),
      bashTable([
        ["python3 --version", "Confirm Python version"],
        ["pip3 install google-genai", "Install Google Generative AI SDK"],
        ["pip3 install fastapi uvicorn", "Install FastAPI and server"],
        ["pip3 install langchain langgraph", "Install LangChain and LangGraph"],
        ["pip3 install chromadb", "Install Chroma vector database"],
        ["pip3 install ragas deepeval", "Install RAG evaluation libraries"],
        ["pip3 list", "List all installed Python packages"],
      ]),
      spacer(),
      h3("Google Cloud CLI (gcloud)"),
      bashTable([
        ["gcloud init", "Initialize and authenticate gcloud"],
        ["gcloud config set project PROJECT_ID", "Set the active GCP project"],
        ["gcloud config list", "Show current gcloud configuration"],
        ["gcloud services enable generativelanguage.googleapis.com", "Enable Gemini API on GCP project"],
        ["gcloud --version", "Verify gcloud installation"],
        ["echo $GOOGLE_API_KEY", "Confirm API key is loaded in environment"],
      ]),
      spacer(),
      h3("Docker"),
      bashTable([
        ["docker --version", "Verify Docker installation"],
        ["docker run hello-world", "Test Docker is running"],
        ["docker build -t myapp .", "Build a Docker image from Dockerfile"],
        ["docker run -p 8000:8000 myapp", "Run container and expose port 8000"],
        ["docker ps", "List running containers"],
        ["docker ps -a", "List all containers including stopped"],
        ["docker stop CONTAINER_ID", "Stop a running container"],
        ["docker images", "List locally built/pulled images"],
        ["docker-compose up", "Start all services defined in docker-compose.yml"],
        ["docker-compose down", "Stop and remove containers"],
      ]),
      spacer(),

      // ── 5. AI / GENAI TERMINOLOGY ─────────────────────────────────────────
      h1("5. AI and GenAI Terminology"),
      p("These are the concepts every AI Platform Engineer must be able to explain clearly in an interview and in daily conversation with teammates."),
      spacer(),
      termTable([
        ["LLM", "Large Language Model. A neural network trained on massive text datasets to predict and generate human-like text. Examples: GPT-4, Claude, Gemini."],
        ["Token", "The basic unit an LLM processes. Roughly 0.75 words. 'Platform engineering' = ~3 tokens. Costs are measured per token."],
        ["Transformer", "The neural network architecture that powers all modern LLMs. Uses attention mechanisms to understand relationships between words across entire sequences."],
        ["Attention mechanism", "The core innovation of transformers. Allows the model to weigh how relevant each token is to every other token — enabling understanding of long-range context."],
        ["Temperature", "Controls randomness of model output. 0.0 = deterministic/precise (good for code). 1.0+ = creative/varied (good for stories). Used in every API call."],
        ["Top-P (nucleus sampling)", "Alternative to temperature. Limits the token pool to the smallest set whose cumulative probability exceeds P. Controls diversity of output."],
        ["System prompt", "A hidden instruction layer that runs before every user message. Defines the model's persona, constraints, and behavior. Example: 'You are a platform engineering mentor.'"],
        ["Prompt engineering", "The craft of designing inputs to get reliable, high-quality outputs from LLMs. Includes zero-shot, few-shot, chain-of-thought, and role prompting patterns."],
        ["Zero-shot prompting", "Asking the model to complete a task with no examples. Relies entirely on the model's training knowledge."],
        ["Few-shot prompting", "Providing 2–5 examples of the desired input/output format before your actual question. Dramatically improves consistency."],
        ["Chain-of-thought", "Prompting the model to reason step-by-step before answering. Improves accuracy on complex tasks. Trigger: 'Think step by step.'"],
        ["Fine-tuning", "Training a pre-trained model on domain-specific data to adapt its behavior. Expensive but produces highly specialized models. Contrast with prompting."],
        ["RAG", "Retrieval Augmented Generation. Grounds LLM responses in real documents by retrieving relevant chunks from a vector database before generating. Standard production pattern."],
        ["Embedding", "A numerical vector representation of text. Similar meaning = vectors close together in space. The foundation of semantic search and RAG pipelines."],
        ["Vector database", "Stores embeddings and enables similarity search. Examples: Chroma (local), Pinecone (managed), Weaviate (open-source), pgvector (PostgreSQL)."],
        ["Semantic search", "Finding results by meaning, not keyword match. A search for 'car' returns results about 'automobile' because their embeddings are similar."],
        ["Function calling / Tool use", "A mechanism where the LLM returns a structured request to call an external function (API, database, calculator). Your code executes the function and feeds the result back."],
        ["Structured output / JSON mode", "Configuring the model to return clean JSON every time — no markdown fences, no prose. Used when you need machine-readable output."],
        ["Context window", "The maximum number of tokens an LLM can process in a single call (input + output). GPT-4: 128K. Claude: 200K. Gemini: up to 1M tokens."],
        ["Hallucination", "When an LLM generates confident-sounding but factually incorrect information. A critical production risk. Mitigated by RAG, guardrails, and faithfulness evaluation."],
        ["Faithfulness", "A RAG evaluation metric. Measures whether the generated answer is actually supported by the retrieved context. Scored by RAGAS."],
        ["Inference", "Running a trained model to generate outputs. What happens every time you call an LLM API. Contrast with training (building the model)."],
        ["Agent", "An LLM that can take actions — calling tools, making decisions, and completing multi-step tasks autonomously. Built with LangGraph, CrewAI, or AutoGen."],
        ["MCP", "Model Context Protocol. Anthropic's open standard for how LLMs connect to external tools and data sources in a standardized way."],
        ["A2A Protocol", "Agent-to-Agent protocol by Google. Defines how multiple AI agents communicate with each other in distributed multi-agent systems."],
      ]),
      spacer(),

      // ── 6. PLATFORM ENGINEERING TERMINOLOGY ──────────────────────────────
      h1("6. Platform Engineering Terminology"),
      p("Platform engineers build and maintain the internal developer platforms, infrastructure tools, and self-service capabilities that enable product teams to ship reliably and quickly."),
      spacer(),
      termTable([
        ["Platform engineering", "The discipline of designing and building toolchains and workflows that enable self-service for software engineering organizations. Combines DevOps, SRE, and cloud engineering."],
        ["GitOps", "An operational model where Git is the single source of truth for infrastructure and application state. All changes go through pull requests. ArgoCD enforces desired state."],
        ["IaC (Infrastructure as Code)", "Managing infrastructure through machine-readable config files instead of manual processes. Tools: Terraform, Pulumi, OpenTofu. Enables reproducibility and version control."],
        ["CI/CD", "Continuous Integration / Continuous Delivery. Automated pipelines that test, build, and deploy code on every commit. Tools: GitHub Actions, Jenkins, CircleCI."],
        ["Kubernetes (K8s)", "The industry-standard container orchestration platform. Manages scheduling, autoscaling, self-healing, and service discovery for containerized workloads at scale."],
        ["Helm", "The package manager for Kubernetes. Helm charts are templated K8s manifests — like npm packages but for cloud infrastructure."],
        ["ArgoCD", "A GitOps continuous delivery tool for Kubernetes. Watches a Git repo and auto-syncs the cluster to match the desired state defined in Git."],
        ["Kustomize", "A Kubernetes configuration management tool. Lets you customize base manifests for different environments (dev/staging/prod) without templating."],
        ["Service mesh", "Infrastructure layer for service-to-service communication. Handles mTLS, traffic routing, load balancing, and observability. Tools: Istio, Linkerd."],
        ["Backstage", "An open-source developer portal by Spotify. Provides a service catalog, documentation hub, and self-service tools for internal developer platforms."],
        ["SLO", "Service Level Objective. A target reliability metric. Example: 99.9% of requests complete in under 200ms. The foundation of SRE reliability engineering."],
        ["SLI", "Service Level Indicator. The actual measured metric underlying an SLO. Example: the percentage of successful requests in a rolling 30-day window."],
        ["Error budget", "The acceptable amount of downtime/errors before violating an SLO. If you have 99.9% SLO, your error budget is 0.1% (about 8.7 hours/year)."],
        ["Observability", "The ability to understand a system's internal state from its external outputs. The three pillars: metrics (Prometheus), logs (Loki), traces (Jaeger/OpenTelemetry)."],
        ["Prometheus", "Open-source metrics collection and alerting. The standard for Kubernetes monitoring. Scrapes metrics from services at configurable intervals."],
        ["Grafana", "Visualization platform for metrics and logs. Connects to Prometheus, Loki, and cloud providers to build dashboards and alerts."],
        ["OpenTelemetry", "Vendor-neutral observability framework. Standardizes how metrics, logs, and traces are collected and exported across distributed systems."],
        ["Drift", "When actual infrastructure state diverges from desired state defined in Git or IaC. ArgoCD and Terraform detect and resolve drift."],
        ["Blue/green deployment", "Running two identical environments (blue = current, green = new). Traffic switches to green after validation. Blue kept as instant rollback."],
        ["Canary deployment", "Gradually routing a small percentage of traffic to a new version. Validates in production with minimal blast radius before full rollout."],
        ["Chaos engineering", "Intentionally injecting failures into production systems to test resilience. Tools: Chaos Mesh, Litmus. Validates SLOs hold under failure."],
      ]),
      spacer(),

      // ── 7. CLOUD ENGINEERING TERMINOLOGY ────────────────────────────────
      h1("7. Cloud Engineering Terminology"),
      termTable([
        ["GCP", "Google Cloud Platform. Kareem's primary cloud provider. Key AI services: Vertex AI, Gemini API, Cloud Run, GKE (Google Kubernetes Engine)."],
        ["Vertex AI", "Google Cloud's unified ML platform. Manages the full ML lifecycle: data prep, training, evaluation, deployment, and monitoring."],
        ["Cloud Run", "GCP's serverless container platform. Runs containerized apps with automatic scaling to zero. Ideal for API deployments and ML inference endpoints."],
        ["GKE", "Google Kubernetes Engine. Managed Kubernetes service on GCP. Handles control plane management, node upgrades, and auto-scaling."],
        ["IAM", "Identity and Access Management. Controls who can do what on cloud resources. Principle of least privilege: grant only the permissions needed."],
        ["Service account", "A non-human identity used by applications and services to authenticate to cloud APIs. Always prefer service accounts over personal credentials in code."],
        ["VPC", "Virtual Private Cloud. An isolated network within a cloud provider. Controls traffic routing, firewall rules, and network segmentation between services."],
        ["Cloud Storage / GCS", "Google Cloud Storage. Object storage for files, datasets, model artifacts, and backups. Accessible via gsutil CLI or Python SDK."],
        ["Artifact Registry", "GCP's managed container and package registry. Stores Docker images, Python packages, and Helm charts. Used in CI/CD pipelines."],
        ["Spot / Preemptible VMs", "Heavily discounted cloud VMs (up to 90% off) that can be reclaimed by the provider. Used for training jobs and batch workloads to reduce GPU costs."],
        ["Autoscaling", "Automatically adjusting compute resources based on load. Horizontal: add more instances. Vertical: increase instance size. Critical for AI inference cost management."],
        ["Load balancer", "Distributes incoming traffic across multiple backend instances. Ensures no single instance is overwhelmed. Layer 4 (TCP) vs Layer 7 (HTTP/HTTPS)."],
        ["Managed service", "A cloud provider runs and maintains the infrastructure (databases, Kubernetes control plane, queues). You manage the application layer only."],
        ["Terraform", "HashiCorp's IaC tool. Defines cloud infrastructure in HCL (HashiCorp Configuration Language). Plan → Apply workflow previews changes before executing."],
        ["gsutil", "CLI tool for Google Cloud Storage. Upload, download, sync, and manage GCS buckets and objects."],
        ["GPU operator", "NVIDIA's Kubernetes operator for managing GPU workloads. Handles driver installation, MIG (Multi-Instance GPU) configuration, and GPU scheduling on K8s."],
        ["KEDA", "Kubernetes Event-Driven Autoscaling. Scales pods based on external metrics — queue depth, GPU utilization, request rate. Enables scale-to-zero for inference."],
      ]),
      spacer(),

      // ── 8. MLOps TERMINOLOGY ─────────────────────────────────────────────
      h1("8. MLOps and LLMOps Terminology"),
      termTable([
        ["MLOps", "Machine Learning Operations. Practices for deploying, monitoring, and maintaining ML models in production reliably at scale. Combines ML, DevOps, and data engineering."],
        ["LLMOps", "LLM Operations. MLOps specifically for large language model applications — prompt versioning, evaluation, cost tracking, drift detection, and deployment pipelines."],
        ["Model serving", "Making a trained model available for inference via an API endpoint. Tools: vLLM, NVIDIA Triton, Hugging Face TGI, KServe."],
        ["vLLM", "Open-source LLM inference engine. Extremely fast throughput via PagedAttention. Standard for self-hosting open models like Llama 3, Mistral."],
        ["KServe", "Kubernetes-native model serving platform. Provides standardized inference APIs, autoscaling, canary rollouts, and A/B testing for ML models on K8s."],
        ["MLflow", "Open-source platform for ML lifecycle management. Tracks experiments, logs metrics/parameters/artifacts, and manages model versions and deployments."],
        ["DVC", "Data Version Control. Git-like versioning for datasets and model files. Integrates with Git to version large binary files stored in cloud storage."],
        ["Kubeflow", "MLOps platform for Kubernetes. Orchestrates ML pipelines: data prep, training, evaluation, and model registration. Uses directed acyclic graphs (DAGs)."],
        ["Ray", "Distributed compute framework for Python. RayTrain for distributed training, RaySever for model serving, RayCluster on Kubernetes."],
        ["Feast", "Open-source feature store. Centralizes feature definitions, computes them offline for training, and serves them online for low-latency inference."],
        ["RAGAS", "Retrieval Augmented Generation Assessment. Python library that evaluates RAG pipelines on faithfulness, answer relevancy, context precision, and recall."],
        ["DeepEval", "Open-source LLM evaluation framework. pytest-style tests for LLM outputs. 14+ metrics. Integrates with GitHub Actions for CI/CD quality gates."],
        ["Langfuse", "Open-source LLM observability platform. Traces every LLM call — tokens, cost, latency, inputs, outputs. Self-hosted via Docker. 21K+ GitHub stars."],
        ["Evidently", "ML monitoring library. Detects data drift, target drift, and concept drift in production ML systems. Integrates with MLflow and Prometheus."],
        ["Quantization", "Reducing model precision (float32 to int8/int4) to decrease memory and increase inference speed with minimal quality loss. QLoRA uses 4-bit quantization for fine-tuning."],
        ["LoRA / QLoRA", "Parameter-Efficient Fine-Tuning (PEFT) techniques. Train only a small number of adapter parameters instead of the full model. Dramatically reduces GPU memory requirements."],
        ["Prompt injection", "An attack where malicious input manipulates an LLM to ignore its system prompt or perform unintended actions. Top vulnerability in OWASP LLM Top 10."],
        ["NeMo Guardrails", "NVIDIA's open-source framework for adding programmable safety rails to LLM applications. Controls input topics, output toxicity, and jailbreak attempts."],
        ["A/B testing (models)", "Routing a percentage of production traffic to two model versions to compare quality, latency, and cost before full rollout."],
      ]),
      spacer(),

      // ── 9. WEEK BY WEEK PROJECTS ─────────────────────────────────────────
      h1("9. Weekly Projects and Deliverables"),
      h3("Week 1 — GenAI Foundations"),
      bullet("Lesson 1–3: How LLMs work, tokens, transformers, attention mechanism"),
      bullet("Lesson 4–5: Temperature, Top-P, system prompts, prompt engineering patterns"),
      bullet("Day 2: First Python script calling Gemini API — token inspection, finish reasons"),
      bullet("Day 3: System prompts + multi-turn conversation memory"),
      bullet("Day 4: Function calling — model routing to real Python functions"),
      bullet("Day 5: Kai mini-agent — full agent loop with memory, 3 tools, session logging"),
      spacer(),
      h3("Week 2 — Building with LLM APIs (Upcoming)"),
      bullet("Streaming responses with FastAPI"),
      bullet("Structured output (JSON mode)"),
      bullet("Multi-provider builds: Gemini + Anthropic Claude"),
      bullet("Deploy chatbot as Docker container"),
      spacer(),
      h3("Week 3 — LangChain and Agentic Patterns (Upcoming)"),
      bullet("LangGraph: stateful multi-step agents"),
      bullet("Four agentic patterns: Reflection, Tool Use, Planning, Multi-Agent"),
      bullet("Human-in-the-loop approval gates"),
      spacer(),

      // ── 10. INTERVIEW CHEAT SHEET ─────────────────────────────────────────
      h1("10. Interview Cheat Sheet"),
      p("These are the exact questions that come up in AI Platform Engineering interviews. Know these cold."),
      spacer(),
      h3("Q: What is the difference between GitOps and ArgoCD?"),
      p("GitOps is the philosophy — Git is the single source of truth for all infrastructure. No one runs kubectl apply manually in production. ArgoCD is the implementation tool that enforces GitOps: it watches your Git repo, detects drift when the cluster diverges from the desired state defined in Git, and auto-syncs to correct it. ArgoCD also self-heals — if someone manually changes production, ArgoCD reverts it within minutes."),
      spacer(),
      h3("Q: How would you architect a cloud-native platform for the AI agent lifecycle?"),
      p("Git repo as source of truth, GitHub Actions CI with lint, test, and DeepEval LLM evaluation gates, Docker build and push to Artifact Registry, ArgoCD GitOps deployment to GKE, LangGraph or CrewAI agent serving behind an API gateway, Langfuse for LLM observability and cost tracking, NeMo Guardrails for input/output safety. For scaling: Kubeflow for training pipelines, KServe and vLLM for model serving, KEDA for GPU autoscaling."),
      spacer(),
      h3("Q: An AI agent produces incorrect outputs in production. How do you diagnose it?"),
      p("Check Langfuse traces first to identify the failing step. Determine whether the issue is retrieval (bad context retrieved from vector DB), reasoning (wrong tool selected), or generation (hallucination). Apply guardrails immediately for mitigation. Add a DeepEval faithfulness test to CI to catch regressions. Rollback to last known good version via ArgoCD if the issue is critical."),
      spacer(),
      h3("Q: What is RAG and when would you use it?"),
      p("Retrieval Augmented Generation. Used when the LLM needs to answer questions about private, recent, or domain-specific data that was not in its training set. Documents are chunked, embedded, and stored in a vector database. At query time, semantically similar chunks are retrieved and injected into the prompt as context. Evaluated with RAGAS metrics: faithfulness, answer relevancy, context precision."),
      spacer(),
      h3("Q: How do tokens affect production cost?"),
      p("Every API call charges per token consumed — both input and output. A complex system prompt, long conversation history, or retrieved RAG context all increase input tokens. Verbose model responses increase output tokens. Platform engineers optimize by compressing prompts, summarizing conversation history, tuning retrieval chunk sizes, and tracking cost-per-request in Langfuse."),
      divider(),

      // ── FOOTER ───────────────────────────────────────────────────────────
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Kareem Rufai  |  github.com/yemyy27  |  Platform Engineering Learning Journey  |  Started April 2026", size: 18, font: "Arial", color: "888888" })],
        spacing: { before: 240 }
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("./README-platform-engineering.docx", buffer);
  console.log("Done!");
});
