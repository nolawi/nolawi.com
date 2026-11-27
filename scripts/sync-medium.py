"""Fetch public Medium story metadata for the static portfolio build."""

import json
import re
from datetime import timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit
from urllib.request import Request, urlopen
from xml.etree import ElementTree

FEED_URL = "https://medium.com/feed/@nolawi"
OUTPUT = Path(__file__).resolve().parent.parent / "content" / "medium-feed.json"
MAX_BYTES = 4 * 1024 * 1024


def read_articles(payload):
    channel = ElementTree.fromstring(payload).find("channel")
    if channel is None:
        raise ValueError("Medium returned no RSS channel")

    articles = {}
    for item in channel.findall("item"):
        title = (item.findtext("title") or "").strip()
        url = urlsplit((item.findtext("link") or "").strip())
        story = re.search(r"-([0-9a-f]{12})/?$", url.path)
        if not title or url.scheme != "https" or url.netloc != "medium.com" or not story:
            continue
        try:
            published = parsedate_to_datetime(item.findtext("pubDate") or "").astimezone(timezone.utc)
        except (ValueError, OverflowError):
            continue
        article_id = f"medium-{story[1]}"
        articles[article_id] = {
            "id": article_id,
            "title": title,
            "url": urlunsplit((url.scheme, url.netloc, url.path, "", "")),
            "date": published.date().isoformat(),
            "status": "published",
            "format": "Article",
            "publication": "Medium",
            "topics": [],
        }
    return list(articles.values())


def main():
    request = Request(FEED_URL, headers={"User-Agent": "NolawiPortfolio/1.0", "Accept": "application/rss+xml"})
    with urlopen(request, timeout=15) as response:
        payload = response.read(MAX_BYTES + 1)
    if len(payload) > MAX_BYTES:
        raise ValueError("Medium feed exceeded the size limit")
    articles = read_articles(payload)
    if not articles:
        raise ValueError("Medium returned no usable stories")
    pending = OUTPUT.with_suffix(".tmp")
    pending.write_text(json.dumps(articles, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    pending.replace(OUTPUT)
    print(f"Fetched {len(articles)} Medium articles.")


if __name__ == "__main__":
    main()
