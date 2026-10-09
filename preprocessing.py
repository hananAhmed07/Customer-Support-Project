import re


def clean_text(text: str) -> str:
    # 1) placeholders: {{Order Number}} -> ph_order_number
    text = re.sub(
        r"\{\{(.*?)\}\}",
        lambda m: "ph_" + re.sub(r"\s+", "_", m.group(1).strip().lower()),
        text,
    )
    # 2) lowercase
    text = text.lower()
    # 3) collapse extra whitespace
    return re.sub(r"\s+", " ", text).strip()