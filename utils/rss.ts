import { XMLParser } from "fast-xml-parser";

export type RssItem = {
  title: string;
  link: string;
  date: Date | null;
  summary: string;
};

const parser = new XMLParser({ ignoreAttributes: false, cdataPropName: "__cdata" });

function text(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const v = value as Record<string, unknown>;
    return text(v.__cdata ?? v["#text"] ?? "");
  }
  return String(value);
}

// strips tags and entities from feed descriptions
export function stripHtml(html: string): string {
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1") // some feeds leave the markers in the text
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"')
    .replace(/&hellip;|&#8230;/g, "...")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// parses an RSS 2.0 (or Atom) document into a flat list of items
export function parseRss(xml: string): RssItem[] {
  const doc = parser.parse(xml);
  const rssItems = doc?.rss?.channel?.item;
  const atomEntries = doc?.feed?.entry;
  const raw: any[] = rssItems ? [].concat(rssItems) : atomEntries ? [].concat(atomEntries) : [];

  return raw
    .map((item) => {
      const link =
        text(item.link) ||
        (Array.isArray(item.link) ? item.link[0]?.["@_href"] : item.link?.["@_href"]) ||
        "";
      const dateText = text(item.pubDate ?? item.published ?? item.updated ?? item["dc:date"]);
      const date = dateText ? new Date(dateText) : null;
      return {
        title: stripHtml(text(item.title)),
        link: String(link).trim(),
        date: date && !isNaN(date.getTime()) ? date : null,
        summary: stripHtml(text(item.description ?? item.summary ?? item.content)).slice(0, 240),
      };
    })
    .filter((i) => i.title && i.link);
}
