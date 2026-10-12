import re

_PLACEHOLDER_RE = re.compile(r"\{\{(.*?)\}\}")
_WS_RE = re.compile(r"\s+")


def clean_text(text: str) -> str:
    text = str(text)
    # 1) placeholders: {{Order Number}} -> ph_order_number
    text = _PLACEHOLDER_RE.sub(
        lambda m: "ph_" + _WS_RE.sub("_", m.group(1).strip().lower()),
        text,
    )
    # 2) lowercase
    text = text.lower()
    # 3) collapse extra whitespace
    return _WS_RE.sub(" ", text).strip()