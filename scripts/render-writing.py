"""Render the article index into the homepage and archive as plain HTML."""

import argparse
from datetime import date
from html import escape
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
START = "<!-- writing:begin -->"
END = "<!-- writing:end -->"


def render(entries, limit=None):
    featured = [entry for entry in entries if entry.get("featured")]
    articles = [entry for entry in entries if not entry.get("featured")]
    lines = []
    for entry in featured:
        url, title, label = (escape(entry[key]) for key in ("url", "title", "label"))
        lines.append(f'<p class="featured-article"><a href="{url}">{title}</a> <span>{label}</span></p>')
    lines.append('<div class="articles">')
    for entry in articles[:limit]:
        url, title, label = (escape(entry[key]) for key in ("url", "title", "label"))
        stamp = date.fromisoformat(entry["date"]) if entry.get("date") else None
        time = f'<time datetime="{stamp.isoformat()}">{stamp:%b %Y}</time>' if stamp else ""
        lines.append(f'<article>{time}<h3><a href="{url}">{title}</a></h3><p>{label}</p></article>')
    lines.append("</div>")
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="check that the generated HTML is current")
    options = parser.parse_args()
    entries = json.loads((ROOT / "articles.json").read_text())
    stale = []
    for filename, limit in (("index.html", 3), ("writing.html", None)):
        path = ROOT / filename
        original = path.read_text()
        before, marker, rest = original.partition(START)
        _, closing, after = rest.partition(END)
        if not marker or not closing:
            raise SystemExit(f"Missing writing markers in {filename}")
        updated = f"{before}{START}\n{render(entries, limit)}\n{END}{after}"
        if options.check:
            if updated != original:
                stale.append(filename)
        elif updated != original:
            path.write_text(updated)
    if stale:
        raise SystemExit("Run scripts/render-writing.py to update: " + ", ".join(stale))


if __name__ == "__main__":
    main()
