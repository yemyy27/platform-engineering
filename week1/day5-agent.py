import os
import json
from datetime import datetime
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

# ── TOOLS ──────────────────────────────────────────────────────────────────

def get_tool_info(tool_name: str) -> dict:
    """Returns platform engineering tool details."""
    db = {
        "docker":      {"category": "containerization", "difficulty": "intermediate", "week": 4},
        "kubernetes":  {"category": "orchestration",    "difficulty": "advanced",     "week": 3},
        "terraform":   {"category": "iac",              "difficulty": "intermediate", "week": 4},
        "prometheus":  {"category": "monitoring",       "difficulty": "intermediate", "week": 5},
        "langchain":   {"category": "ai framework",     "difficulty": "intermediate", "week": 2},
        "langgraph":   {"category": "agent framework",  "difficulty": "advanced",     "week": 2},
    }
    return db.get(tool_name.lower(), {"error": f"{tool_name} not in database"})

def get_week_topics(week_number: int) -> dict:
    """Returns curriculum topics for a given week."""
    curriculum = {
        1: ["GenAI foundations", "Gemini API", "system prompts", "memory", "function calling"],
        2: ["LangChain", "LangGraph", "agents", "tool use"],
        3: ["RAG pipelines", "vector databases", "embeddings"],
        4: ["Docker", "CI/CD", "GitHub Actions"],
        5: ["Observability", "Langfuse", "guardrails", "safety"],
    }
    topics = curriculum.get(week_number)
    if not topics:
        return {"error": f"Week {week_number} not found"}
    return {"week": week_number, "topics": topics}

def get_learning_progress(username: str) -> dict:
    """Returns a user's learning progress."""
    progress = {
        "kareem": {
            "current_week": 1,
            "current_day": 5,
            "completed": ["GenAI foundations", "Gemini API", "system prompts", "memory", "function calling"],
            "next_topic": "Building a full agent",
            "streak_days": 5,
        }
    }
    return progress.get(username.lower(), {"error": f"User {username} not found"})

# ── TOOL DEFINITIONS ────────────────────────────────────────────────────────

tools = [
    types.Tool(function_declarations=[
        types.FunctionDeclaration(
            name="get_tool_info",
            description="Get details about a platform engineering tool like Docker, Kubernetes, Terraform, LangChain",
            parameters=types.Schema(
                type="OBJECT",
                properties={"tool_name": types.Schema(type="STRING")},
                required=["tool_name"]
            )
        ),
        types.FunctionDeclaration(
            name="get_week_topics",
            description="Get the topics covered in a specific week of the platform engineering curriculum",
            parameters=types.Schema(
                type="OBJECT",
                properties={"week_number": types.Schema(type="INTEGER")},
                required=["week_number"]
            )
        ),
        types.FunctionDeclaration(
            name="get_learning_progress",
            description="Get a student's current learning progress and completed topics",
            parameters=types.Schema(
                type="OBJECT",
                properties={"username": types.Schema(type="STRING")},
                required=["username"]
            )
        ),
    ])
]

available_functions = {
    "get_tool_info": get_tool_info,
    "get_week_topics": get_week_topics,
    "get_learning_progress": get_learning_progress,
}

# ── AGENT LOOP ──────────────────────────────────────────────────────────────

conversation_history = []

SYSTEM_PROMPT = """You are a platform engineering learning assistant for Kareem.
You help him understand tools, track his progress, and guide his learning journey.
Use tools when asked about specific tools, weeks, or progress.
Be concise, practical, and encouraging."""

def run_agent(user_input: str):
    # Add user message to history
    conversation_history.append(
        types.Content(role="user", parts=[types.Part(text=user_input)])
    )

    # First model call
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=conversation_history,
        config=types.GenerateContentConfig(
            tools=tools,
            system_instruction=SYSTEM_PROMPT,
            temperature=0.3,
        )
    )

    part = response.candidates[0].content.parts[0]

    # If model wants to call a function
    if part.function_call:
        fn_name = part.function_call.name
        fn_args = dict(part.function_call.args)
        print(f"  [calling {fn_name}{fn_args}]")

        # Execute the function
        result = available_functions[fn_name](**fn_args)

        # Add tool exchange to history
        conversation_history.append(
            types.Content(role="model", parts=[part])
        )
        conversation_history.append(
            types.Content(role="tool", parts=[types.Part(
                function_response=types.FunctionResponse(
                    name=fn_name, response=result
                )
            )])
        )

        # Second call — model forms final answer using tool result
        final = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=conversation_history,
            config=types.GenerateContentConfig(
                tools=tools,
                system_instruction=SYSTEM_PROMPT,
                temperature=0.3,
            )
        )
        reply = final.text
        conversation_history.append(
            types.Content(role="model", parts=[types.Part(text=reply)])
        )
    else:
        reply = part.text
        conversation_history.append(
            types.Content(role="model", parts=[types.Part(text=reply)])
        )

    return reply

# ── MAIN ────────────────────────────────────────────────────────────────────

print("=" * 50)
print("  Platform Engineering Agent")
print(f"  {datetime.now().strftime('%A, %B %d')}")
print("=" * 50)
print("Type 'quit' to exit\n")

while True:
    user_input = input("You: ").strip()
    if not user_input:
        continue
    if user_input.lower() == "quit":
        print("Agent: Good work today, Kareem. Keep building.")
        break
    reply = run_agent(user_input)
    print(f"\nAgent: {reply}\n")