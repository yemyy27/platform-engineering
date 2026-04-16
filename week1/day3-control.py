import os
import json
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

prompt = """
Analyze this tech tool and return ONLY a JSON object, no markdown, no explanation:

Tool: Docker

Return this exact structure:
{
  "name": "tool name",
  "category": "category",
  "difficulty": "beginner/intermediate/advanced",
  "use_case": "one sentence",
  "related_tools": ["tool1", "tool2", "tool3"]
}
"""

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=prompt,
    config=types.GenerateContentConfig(
        system_instruction="You are a JSON API. Return only valid JSON, nothing else. No markdown fences.",
        temperature=0.1,
    )
)

# Parse and pretty print
data = json.loads(response.text)
print(json.dumps(data, indent=2))

# Access individual fields like a real app would
print(f"\nTool: {data['name']}")
print(f"Difficulty: {data['difficulty']}")
print(f"Related: {', '.join(data['related_tools'])}")