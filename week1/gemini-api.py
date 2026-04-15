import os
from google import genai

# Initialize the client using your API key from environment
client = genai.Client(api_key=os.environ.get("GOOGLE_API_KEY"))

# Your first prompt
response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Explain what a Large Language Model is in 3 sentences, like I'm a developer hearing it for the first time."
)

# Print the response
print(response.text)
