import re


class ResumeCleaner:

    @staticmethod
    def clean(text: str) -> str:
        if not text:
            return ""

        # Remove invisible Unicode characters
        text = text.replace("\u200b", "")
        text = text.replace("\ufeff", "")

        
        text = text.replace("\t", " ")

      
        bullets = ["•", "●", "▪", "■", "◆", "✓", "*"]
        for bullet in bullets:
            text = text.replace(bullet, "-")

        
        text = re.sub(r"[ ]{2,}", " ", text)

       
        text = re.sub(r"\n{3,}", "\n\n", text)

       
        text = re.sub(r"Page\s+\d+", "", text, flags=re.IGNORECASE)

        
        text = (
            text.replace("“", '"')
                .replace("”", '"')
                .replace("’", "'")
        )

       
        text = text.strip()

        return text