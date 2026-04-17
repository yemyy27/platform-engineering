from google import genai
from google.genai import types
import os
import json
from datetime import datetime

client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

# ── Tools ──────────────────────────────────────────────────────────────────

def get_tool_info(tool_name: str) -> str:
    tools = {
        "docker": "Docker containers package apps + dependencies. Platform engineers use it for consistent environments across dev/staging/prod.",
        "kubernetes": "Kubernetes (K8s) orchestrates containers at scale. Handles scheduling, autoscaling, self-healing, and service discovery.",
        "terraform": "Terraform is IaC — define cloud infrastructure in code. Reproducible, version-controlled infra.",
        "langchain": "LangChain is a framework for building LLM-powered apps — chains, agents, RAG pipelines.",
        "langfuse": "Langfuse is open-source LLM observability — traces every API call, cost, latency, and output quality.",
    }
    key = tool_name.lower()
    return tools.get(key, f"No info found for '{tool_name}'. Try: docker, kubernetes, terraform, langchain, langfuse.")

def get_week_topics(week_number: int) -> str:
    weeks = {
        1: "GenAI Foundations: LLMs, tokens, transformers, temperature, prompt engineering, first Gemini API calls.",
        2: "Building with LLM APIs: streaming, system prompts, memory, function calling, JSON output, FastAPI + Docker.",
        3: "LangChain & Agentic Patterns: LangGraph, tool use, multi-step agents, human-in-the-loop.",
        4: "RAG Pipelines: document chunking, embeddings, vector stores, hybrid search, RAGAS evaluation.",
        5: "Multi-Agent Systems: CrewAI, AutoGen, A2A protocol, MCP, enterprise integration.",
    }
    return weeks.get(week_number, f"Week {week_number} not found. Curriculum covers weeks 1–5 in the short-term track.")

def get_interview_tip(topic: str) -> str:
    tips = {
        "rag": "For RAG interviews: always mention chunking strategy, embedding model choice, and how you'd evaluate with RAGAS — faithfulness + answer relevancy.",
        "agents": "For agent interviews: whiteboard the 4 patterns — Reflection, Tool Use, Planning, Multi-Agent. Mention LangGraph for stateful agents.",
        "observability": "For observability: lead with Langfuse for LLM tracing, then Prometheus/Grafana for infra metrics. Mention OWASP Top 10 for LLMs.",
        "ci/cd": "For CI/CD: describe the full story — GitHub Actions → lint + DeepEval tests → Docker build → ArgoCD GitOps deploy. That story wins interviews.",
    }
    key = topic.lower()
    return tips.get(key, f"No tip for '{topic}'. Try: rag, agents, observability, ci/cd.")

# ── Tool dispatcher ─────────────────────────────────────────────────────────

TOOLS = [
    {
        "name": "get_tool_info",
        "description": "Returns a plain-English explanation of a platform engineering tool.",
        "parameters": {
            "type": "object",
            "properties": {
                "tool_name": {"type": "string", "description": "Name of the tool, e.g. docker, kubernetes, langchain"}
            },
            "required": ["tool_name"]
        }
    },
    {
        "name": "get_week_topics",
        "description": "Returns the topics covered in a given week of the platform engineering curriculum.",
        "parameters": {
            "type": "object",
            "properties": {
                "week_number": {"type": "integer", "description": "Week number (1-5)"}
            },
            "required": ["week_number"]
        }
    },
    {
        "name": "get_interview_tip",
        "description": "Returns interview advice for a given platform engineering topic.",
        "parameters": {
            "type": "object",
            "properties": {
                "topic": {"type": "string", "description": "Topic name, e.g. rag, agents, observability, ci/cd"}
            },
            "required": ["topic"]
        }
    }
]

def dispatch(name, args):
    if name == "get_tool_info":
        return get_tool_info(**args)
    elif name == "get_week_topics":
        return get_week_topics(**args)
    elif name == "get_interview_tip":
        return get_interview_tip(**args)
    return "Unknown tool."

# ── Session log ─────────────────────────────────────────────────────────────

log_path = f"session-log-{datetime.now().strftime('%Y%m%d-%H%M%S')}.txt"

def log(role, text):
    with open(log_path, "a") as f:
        f.write(f"[{datetime.now().strftime('%H:%M:%S')}] {role.upper()}: {text}\n\n")

# ── Agent loop ───────────────────────────────────────────────────────────────

SYSTEM = """You are Kai, a sharp and practical platform engineering mentor.
You help Kareem Rufai learn AI platform engineering through clear explanations and hands-on challenges.
You have access to tools for curriculum info, tool explanations, and interview tips.
Keep answers focused. When you use a tool, integrate the result naturally into your answer.
After answering, always end with one short follow-up question or challenge to keep Kareem engaged."""

history = []

print("╔══════════════════════════════════════╗")
print("║  Kai — Platform Engineering Mentor   ║")
print("║  Type 'quit' to exit                 ║")
print("╚══════════════════════════════════════╝\n")

while True:
    user_input = input("Kareem: ").strip()
    if not user_input:
        continue
    if user_input.lower() == "quit":
        print(f"\nSession saved → {log_path}")
        break

    log("kareem", user_input)
    history.append({"role": "user", "parts": [{"text": user_input}]})

    # First call — model may request a tool
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=history,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM,
            tools=[{"function_declarations": TOOLS}]
        )
    )

    part = response.candidates[0].content.parts[0]

    # If model called a tool
    if hasattr(part, "function_call") and part.function_call:
        fn = part.function_call
        result = dispatch(fn.name, dict(fn.args))

        # Feed tool result back
        history.append({"role": "model", "parts": [{"function_call": {"name": fn.name, "args": dict(fn.args)}}]})
        history.append({"role": "user", "parts": [{"function_response": {"name": fn.name, "response": {"result": result}}}]})

        # Second call — model composes final answer
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=history,
            config=types.GenerateContentConfig(system_instruction=SYSTEM)
        )
        reply = response.text
    else:
        reply = part.text

    history.append({"role": "model", "parts": [{"text": reply}]})
    log("kai", reply)

    print(f"\nKai: {reply}")
    print(f"     [tokens: {response.usage_metadata.total_token_count}]\n")