import os
from config.config import Config

# Dynamically import the appropriate client based on provider
if Config.LLM_PROVIDER.lower() == "openai":
    from openai import OpenAI
    _client = OpenAI(api_key=Config.LLM_API_KEY)
else:
    raise ValueError(f"Unsupported LLM provider: {Config.LLM_PROVIDER}")

def ask(prompt: str, system_prompt: str | None = None) -> str:
    """Send a prompt to the configured LLM and return the response text.
    Args:
        prompt: The user query or instruction.
        system_prompt: Optional system‑level instruction to guide the model.
    Returns:
        The model's reply as a stripped string.
    """
    messages = [{"role": "user", "content": prompt}]
    if system_prompt:
        messages.insert(0, {"role": "system", "content": system_prompt})
    try:
        resp = _client.chat.completions.create(
            model=Config.LLM_MODEL,
            messages=messages,
            temperature=0.2,
            max_tokens=800,
        )
        return resp.choices[0].message.content.strip()
    except Exception as exc:
        # Graceful fallback – caller can decide what to do
        return f"Sorry, I couldn’t reach the AI service right now. ({exc})"
