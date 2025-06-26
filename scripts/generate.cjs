import fs from "fs";
import Parser from "rss-parser";

// Inisialisasi parser dengan customFields jika pakai media:thumbnail
const parser = new Parser({
  customFields: {
    item: ['media:thumbnail', 'content:encoded']
  }
});

const sources = [
  { name: "cekfakta", url: "https://www.tempo.co/api/gateway/rss/free/cekfakta" },
  { name: "ekonomi", url: "https://www.tempo.co/api/gateway/rss/free/ekonomi" },
  { name: "hukum", url: "https://www.tempo.co/api/gateway/rss/free/hukum" },
  { name: "wawancara", url: "https://www.tempo.co/api/gateway/rss/free/wawancara" },
  { name: "investigasi", url: "https://www.tempo.co/api/gateway/rss/free/investigasi" }
];

function extractThumbnail(item) {
  // 1. media:thumbnail
  if (item["media:thumbnail"]?.$?.url) return item["media:thumbnail"].$.url;

  // 2. content:encoded atau content
  const html = item["content:encoded"] || item.content || "";
  const match = html.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/i);
  if (match) return match[1];

  // 3. kosong fallback
  return "";
}

function escapeXml(str) {
  return str?.replace(/[<>&'"]/g, c => (
    { '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]
  )) || '';
}

async function convertFeed(name, url) {
  const feed = await parser.parseURL(url);

  const items = feed.items.slice(0, 9).map((item, index) => {
    const thumbnail = extractThumbnail(item);
    return `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid>${index + 1}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description>${escapeXml(item.contentSnippet || '')}</description>
      <thumbnail>${thumbnail}</thumbnail>
    </item>`;
  }).join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(feed.title)}</title>
    <link>${feed.link}</link>
    <description>${escapeXml(feed.description)}</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>id-ID</language>
${items}
  </channel>
</rss>`;

  fs.writeFileSync(`free-${name}.xml`, rss.trim());
  console.log(`✅ Generated free-${name}.xml`);
}

(async () => {
  for (const source of sources) {
    await convertFeed(source.name, source.url);
  }
})();
