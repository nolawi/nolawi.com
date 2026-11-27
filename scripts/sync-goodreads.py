"""Refresh public title and author metadata from a Goodreads Read shelf."""

import json
import os
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlencode
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from xml.etree import ElementTree

OUTPUT = Path(__file__).resolve().parent.parent / "content" / "goodreads-feed.json"
MAX_BYTES = 4 * 1024 * 1024


def read_books(payload):
    channel = ElementTree.fromstring(payload).find("channel")
    if channel is None:
        raise ValueError("Goodreads returned no RSS channel")

    books = []
    for item in channel.findall("item"):
        title = (item.findtext("title") or "").strip()
        author = (item.findtext("author_name") or "").strip()
        book_id = (item.findtext("book_id") or "").strip()
        if title and author and re.fullmatch(r"[0-9]+", book_id):
            book = {"title": title, "author": author,
                    "url": f"https://www.goodreads.com/book/show/{book_id}"}
            cover = (item.findtext("book_large_image_url") or "").strip()
            if cover.startswith("https://i.gr-assets.com/"):
                book["cover"] = cover
            books.append(book)
    return books


class WidgetBooks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.books = []
        self.book = None
        self.field = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        css = attrs.get("class", "")
        if tag == "div" and css.startswith("gr_custom_each_container_"):
            self.finish_book()
            self.book = {"title": "", "author": "", "url": ""}
        if self.book is None:
            return
        if tag == "div":
            self.field = next((field for field in ("title", "author")
                               if css.startswith(f"gr_custom_{field}_")), None)
        if tag == "img" and css != "gr_custom_logo":
            cover = attrs.get("src", "")
            if cover.startswith("https://i.gr-assets.com/images/") and "/books/" in cover:
                self.book["cover"] = cover
        if tag == "a" and self.field == "title":
            match = re.match(r"https://www\.goodreads\.com/review/show/[0-9]+(?=[?&#]|$)", attrs.get("href", ""))
            if match:
                self.book["url"] = match[0]

    def handle_endtag(self, tag):
        if tag == "div":
            self.field = None

    def handle_data(self, data):
        if self.field:
            self.book[self.field] += data

    def finish_book(self):
        if self.book:
            self.book["title"] = self.book["title"].strip()
            self.book["author"] = re.sub(r"^by\s+", "", self.book["author"].strip())
            if all(self.book.values()):
                self.books.append(self.book)


def read_widget(payload):
    match = re.search(r"var widget_code = '((?:\\.|[^'\\])*)'", payload.decode("utf-8"), re.S)
    if not match:
        raise ValueError("Goodreads returned no book widget")
    # Decode the quoted HTML payload as data. Never execute the widget script.
    html = json.loads('"' + match[1].replace(r"\'", "'") + '"')
    parser = WidgetBooks()
    parser.feed(html)
    parser.close()
    parser.finish_book()
    return parser.books


def fetch(url):
    request = Request(url, headers={"User-Agent": "NolawiPortfolio/1.0"})
    with urlopen(request, timeout=15) as response:
        payload = response.read(MAX_BYTES + 1)
    if len(payload) > MAX_BYTES:
        raise ValueError("Goodreads response exceeded the size limit")
    return payload


def fetch_rss(user_id):
    seen_pages = set()
    for page in range(1, 11):
        query = urlencode({"shelf": "read", "per_page": 100, "page": page})
        entries = read_books(fetch(f"https://www.goodreads.com/review/list_rss/{user_id}?{query}"))
        page_key = tuple(book["url"] for book in entries)
        if not entries or page_key in seen_pages:
            break
        seen_pages.add(page_key)
        yield from entries


def fetch_widget(user_id):
    for order in ("d", "a"):
        query = urlencode({"shelf": "read", "num_books": 100, "sort": "date_added", "order": order,
                           "show_title": 1, "show_author": 1, "show_cover": 1, "cover_size": "medium", "widget_id": 1})
        entries = read_widget(fetch(f"https://www.goodreads.com/review/custom_widget/{user_id}?{query}"))
        yield from entries
        if len(entries) < 100:
            break


def main():
    user_id = os.environ.get("GOODREADS_USER_ID", "").strip() or "22731505"
    if not re.fullmatch(r"[0-9]+", user_id):
        raise ValueError("GOODREADS_USER_ID must be a numeric Goodreads profile ID")

    try:
        entries = list(fetch_rss(user_id))
    except HTTPError as error:
        if error.code not in (404, 410):
            raise
        entries = []
    if not entries:
        entries = list(fetch_widget(user_id))
    if not entries:
        raise ValueError("Goodreads returned no usable Read entries")

    books = {}
    for book in entries:
        key = (book["title"].casefold(), book["author"].casefold())
        books.setdefault(key, book)

    pending = OUTPUT.with_suffix(".tmp")
    pending.write_text(json.dumps(list(books.values()), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    pending.replace(OUTPUT)
    print(f"Fetched {len(books)} books from the Goodreads Read shelf.")


if __name__ == "__main__":
    main()
