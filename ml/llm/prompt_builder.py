from pathlib import Path
import json

PROMPT_DIR = Path(__file__).parent / "prompts"


def load_prompt(filename):
    return (PROMPT_DIR / filename).read_text(encoding="utf-8")


def build_prompt(analysis):
    system_prompt = load_prompt("system_prompt.txt")
    analysis_prompt = load_prompt("analysis_prompt.txt")

    analysis_json = json.dumps(
        analysis,
        indent=4
    )

    final_prompt = f"""
{system_prompt}

{analysis_prompt}

Analysis JSON:

{analysis_json}
"""

    return final_prompt