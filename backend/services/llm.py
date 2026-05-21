import os
from config.config import Config

# Lazily obtain an OpenAI client based on configuration
def _get_client():
    """Create and return an OpenAI client using the configured API key.

    Raises:
        RuntimeError: If the OPENAI_API_KEY is not set in the environment.
        ValueError: If an unsupported LLM provider is configured.
    """
    if Config.LLM_PROVIDER.lower() != "openai":
        raise ValueError(f"Unsupported LLM provider: {Config.LLM_PROVIDER}")
    api_key = Config.LLM_API_KEY
    if not api_key:
        raise RuntimeError(
            "Missing OPENAI_API_KEY. Add it to .env (e.g., OPENAI_API_KEY=your-key)."
        )
    from openai import OpenAI
    return OpenAI(api_key=api_key)


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
        resp = _get_client().chat.completions.create(
            model=Config.LLM_MODEL,
            messages=messages,
            temperature=0.2,
            max_tokens=800,
        )
        return resp.choices[0].message.content.strip()
    except Exception as exc:
        # Graceful fallback – caller can decide what to do
        return f"Sorry, I couldn’t reach the AI service right now. ({exc})"
