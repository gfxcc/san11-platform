import html2text


def get_text_from_html(html: str) -> str:
    h = html2text.HTML2Text()
    h.ignore_links = True
    return h.handle(html)
