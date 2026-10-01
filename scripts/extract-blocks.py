"""Re-fetch every live page and save its body as ordered blocks [tag, text] (h1-h6, p, li).
Output: docs/source-audit/blocks/<page>.json. Body = from the first <h1>/<h2> after the nav
up to the shared footer ("LET'S TALK!"). Usage: python scripts/extract-blocks.py"""
import json, re, urllib.request
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs/source-audit/blocks"
OUT.mkdir(parents=True, exist_ok=True)
PAGES = ROOT / "docs/source-audit/pages"
TAGS = {"h1", "h2", "h3", "h4", "h5", "h6", "p", "li"}
SKIP = {"script", "style", "noscript", "svg", "template"}


class Blocks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.blocks, self.stack, self.skip = [], [], 0

    def handle_starttag(self, tag, attrs):
        if tag in SKIP:
            self.skip += 1
        elif tag in TAGS:
            self.stack.append([tag, ""])
        elif tag == "br" and self.stack:
            self.stack[-1][1] += "\n"

    def handle_endtag(self, tag):
        if tag in SKIP and self.skip:
            self.skip -= 1
        elif tag in TAGS and self.stack and self.stack[-1][0] == tag:
            t, txt = self.stack.pop()
            txt = re.sub(r"[ \t ​]+", " ", txt).strip()
            txt = re.sub(r" *\n *", "\n", txt)
            if txt:
                if self.stack:  # nested (e.g. p inside li): merge into parent
                    self.stack[-1][1] += txt
                else:
                    self.blocks.append([t, txt])

    def handle_data(self, data):
        if not self.skip and self.stack:
            self.stack[-1][1] += data


for f in sorted(PAGES.glob("*.txt")):
    url = f.read_text(encoding="utf-8").splitlines()[0].replace("URL: ", "").strip()
    html = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=40).read().decode("utf-8", "replace")
    p = Blocks()
    p.feed(html)
    blocks = p.blocks
    end = next((i for i, b in enumerate(blocks) if b[1].upper().startswith("LET'S TALK")), len(blocks))
    blocks = blocks[:end]
    (OUT / f"{f.stem}.json").write_text(json.dumps({"url": url, "blocks": blocks}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{f.stem}: {len(blocks)} blocks")
