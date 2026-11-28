"""Save 13 weeks of public GitLab contribution counts as calendar levels."""

import json
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.request import Request, urlopen

URL = "https://gitlab.com/users/nolawi/calendar.json"
OUTPUT = Path(__file__).resolve().parent.parent / "content" / "gitlab-activity-latest.json"


def main():
    request = Request(URL, headers={"Accept": "application/json", "User-Agent": "NolawiPortfolio/1.0"})
    with urlopen(request, timeout=15) as response:
        counts = json.load(response)
    if not isinstance(counts, dict) or any(type(n) is not int or n < 0 for n in counts.values()):
        raise ValueError("Unexpected GitLab calendar response")
    end = datetime.now(timezone.utc).date()
    start = end - timedelta(days=(end.weekday() + 1) % 7 + 84)
    levels = []
    for offset in range((end - start).days + 1):
        count = counts.get((start + timedelta(days=offset)).isoformat(), 0)
        levels.append(sum(count > limit for limit in (0, 9, 19, 30)))
    pending = OUTPUT.with_suffix(".tmp")
    pending.write_text(json.dumps({"through": end.isoformat(), "levels": levels}) + "\n", encoding="utf-8")
    pending.replace(OUTPUT)
    print(f"Fetched GitLab calendar: {sum(level > 0 for level in levels)} public active days.")


if __name__ == "__main__":
    main()
