from google import genai

client = genai.Client(
    vertexai=True,
    project="platform-eng-kareem",
    location="us-east1"
)

prompts = [
    "Give me a creative name for a DevOps monitoring tool.",
    "List three things platform engineers do.",
    "What does 'idempotent' mean in plain English?"
]

for temp in [0.0, 1.0]:
    print(f"\n--- Temperature: {temp} ---")
    for p in prompts:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=p,
            config={"temperature": temp}
        )
        print(f"Q: {p}")
        print(f"A: {response.text.strip()}\n")