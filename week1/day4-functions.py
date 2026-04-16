import os
import json
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

# These are your tools — real Python functions
def get_tool_info(tool_name: str) -> dict:
    """Returns info about a platform engineering tool."""
    tools_db = {
        "docker": {"category": "containerization", "difficulty": "intermediate", "week": 1},
        "kubernetes": {"category": "orchestration", "difficulty": "advanced", "week": 3},
        "terraform": {"category": "iac", "difficulty": "intermediate", "week": 4},
        "prometheus": {"category": "monitoring", "difficulty": "intermediate", "week": 5},
    }
    tool = tool_name.lower()
    return tools_db.get(tool, {"error": f"{tool_name} not found in database"})

def get_week_topics(week_number: int) -> dict:
    """Returns what topics are covered in a given week."""
    curriculum = {
        1: ["GenAI foundations", "Gemini API", "system prompts", "function calling"],
        2: ["LangChain", "LangGraph", "agents", "tool use"],
        3: ["RAG pipelines", "vector databases", "embeddings"],
        4: ["Docker", "CI/CD", "GitHub Actions"],
    }
    return {"week": week_number, "topics": curriculum.get(week_number, ["not found"])}

# Tell the model what tools exist
tools = [
    types.Tool(function_declarations=[
        types.FunctionDeclaration(
            name="get_tool_info",
            description="Get information about a platform engineering tool like Docker, Kubernetes, Terraform",
            parameters=types.Schema(
                type="OBJECT",
                properties={
                    "tool_name": types.Schema(type="STRING", description="Name of the tool")
                },
                required=["tool_name"]
            )
        ),
        types.FunctionDeclaration(
            name="get_week_topics",
            description="Get the topics covered in a specific week of the curriculum",
            parameters=types.Schema(
                type="OBJECT",
                properties={
                    "week_number": types.Schema(type="INTEGER", description="Week number 1-4")
                },
                required=["week_number"]
            )
        ),
    ])
]

# Map function names to actual functions
available_functions = {
    "get_tool_info": get_tool_info,
    "get_week_topics": get_week_topics,
}

def chat_with_tools(user_message: str):
    print(f"\nYou: {user_message}")
    
    # First call — model decides if it needs a tool
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=user_message,
        config=types.GenerateContentConfig(
            tools=tools,
            system_instruction="You are a platform engineering assistant. Use tools to answer questions accurately.",
        )
    )
    
    # Check if model wants to call a function
    part = response.candidates[0].content.parts[0]
    
    if part.function_call:
        fn_name = part.function_call.name
        fn_args = dict(part.function_call.args)
        print(f"[Model calling: {fn_name}({fn_args})]")
        
        # Run the actual function
        result = available_functions[fn_name](**fn_args)
        print(f"[Function returned: {result}]")
        
        # Send result back to model for final answer
        final_response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                types.Content(role="user", parts=[types.Part(text=user_message)]),
                types.Content(role="model", parts=[part]),
                types.Content(role="tool", parts=[types.Part(
                    function_response=types.FunctionResponse(
                        name=fn_name,
                        response=result
                    )
                )])
            ],
            config=types.GenerateContentConfig(tools=tools)
        )
        print(f"Gemini: {final_response.text}")
    else:
        print(f"Gemini: {part.text}")

# Test it
chat_with_tools("Tell me about Kubernetes")
chat_with_tools("What topics are in week 2?")
chat_with_tools("What's the weather like today?")