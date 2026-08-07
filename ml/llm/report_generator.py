from prompt_builder import build_prompt
from providers.ollama_provider import OllamaProvider

def report_generation(analysis):
    provider = OllamaProvider()
    prompt = build_prompt(analysis)
    response = provider.generate(prompt)
    return response