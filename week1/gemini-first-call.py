from google import genai
import os

client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

print("=== Gemini CLI ===")
print("Type your question. Type 'quit' to exit.\n")

while True:
    user_input = input("You: ")
    
    if user_input.lower() == "quit":
        print("Bye!")
        break

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=user_input
    )

    print(f"\nGemini: {response.text}")
    print(f"[tokens used: {response.usage_metadata.total_token_count}]\n")