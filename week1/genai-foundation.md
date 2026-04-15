# Week 1 - GenAI Foundations

## What does an LLM actually do at its core?
An LLM predicts the next most likely token given everything 
before it, one token at a time, until the response is complete.

## What is a token?
A token is a chunk of text - roughly 3/4 of a word. LLMs don't 
read words, they read tokens. APIs charge per token and models 
have a maximum token limit called a context window.

## What does attention do in a transformer?
Attention helps the model figure out which words in a sentence 
are related to each other. For example in "The cat was tired so 
it slept" - attention figures out that "it" means "the cat", 
not something else.

## Word vs Token - Why a Platform Engineer Cares
A word is a human readable unit of language. A token is how an 
LLM actually reads text - roughly 3/4 of a word. The word 
"unbelievable" is 3 tokens, not 1. APIs charge per token, models 
have a maximum context window measured in tokens, and when 
processing thousands of documents you need to estimate token 
counts to control costs and avoid hitting limits.

## Temperature
- Temperature 0 = deterministic, use for structured outputs
- Temperature 1 = creative, use for open ended tasks
- Never set above 1.5 in production

## Top-P
- Controls the pool of tokens considered
- Adjust temperature OR top-p, not both

## System Prompt
- Instructions given before the conversation
- Sets role, tone, rules, and constraints

## You're building a platform that extracts invoice data from emails into JSON. What temperature would you set and why?
I would set temperature to 0 because invoice extraction requires consistent, deterministic output. We need the same invoice to always produce the same JSON structure — creativity would introduce errors in a financial system.

Day 2 
## Day 2 - First Gemini API Call

### What I built
- Interactive CLI tool that calls Gemini 2.5 Flash
- Token usage inspector to track costs per request

### Key concepts learned

**SDK:** Use `google-genai` (new) not `google.generativeai` (deprecated)

**API call structure:**
```python
from google import genai
client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])
response = client.models.generate_content(model="gemini-2.5-flash", contents="your prompt")
```

**Token anatomy:**
- Input tokens = your prompt (cheap)
- Output tokens = model response (costs more)
- "What is Docker?" prompt → 2,810 tokens total

**Finish reasons:**
- `STOP` = model finished naturally
- `MAX_TOKENS` = got cut off
- `SAFETY` = blocked by safety filters

**Real world insight:** Every API call is a token bill.
Long prompts + detailed answers = higher cost.
Production systems optimize for token efficiency.

### Commands used
```bash
pip3.11 install google-genai
python3 gemini-first-call.py
```

### Files created
- `week1/gemini-first-call.py` — interactive Gemini CLI