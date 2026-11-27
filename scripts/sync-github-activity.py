"""Save the last 13 weeks of public contribution levels from GitHub."""

import json
from datetime import date, timedelta
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import Request, urlopen

URL = "https://github.com/users/nolawi/contributions"
OUTPUT = Path(__file__).resolve().parent.parent / "content" / "github-activity-latest.json"
MAX_BYTES = 2 * 1024 * 1024


class Calendar(HTMLParser):
    def __init__(self):
        super().__init__()
        self.days = {}

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        level = attrs.get("data-level")
        if tag == "td" and "data-date" in attrs and level in {"0", "1", "2", "3", "4"}:
            self.days[date.fromisoformat(attrs["data-date"])] = int(level)


def main():
    request = Request(URL, headers={"User-Agent": "NolawiPortfolio/1.0"})
    with urlopen(request, timeout=15) as response:
        html = response.read(MAX_BYTES + 1)
    if len(html) > MAX_BYTES:
        raise ValueError("GitHub calendar exceeded the size limit")
    calendar = Calendar()
    calendar.feed(html.decode("utf-8"))
    if not calendar.days:
        raise ValueError("GitHub returned no contribution calendar")
    end = max(calendar.days)
    start = end - timedelta(days=(end.weekday() + 1) % 7 + 84)
    days = [calendar.days[start + timedelta(days=offset)] for offset in range((end - start).days + 1)]
    pending = OUTPUT.with_suffix(".tmp")
    pending.write_text(json.dumps({"through": end.isoformat(), "levels": days}) + "\n", encoding="utf-8")
    pending.replace(OUTPUT)
    print(f"Fetched {len(days)} contribution days through {end}.")


if __name__ == "__main__":
    main()
