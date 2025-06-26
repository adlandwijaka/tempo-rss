import fs from "fs";
import Parser from "rss-parser";
const parser = new Parser({
  customFields: {
    item: ['media:thumbnail']
  }
});

const sources = [
  { name: "cekfakta", url: "https://www.tempo.co/api/gateway/rss/free/cekfakta" },
  { name: "ekonomi", url: "https://www.tempo.co/api/gateway/rss/free/ekonomi" },
  { name: "hukum", url: "https://www.tempo.co/api/gateway/rss/free/hukum" },
  { name: "wawancara", url: "https://www.tempo.co/api/gateway/rss/free/wawancara" },
  { name: "investigasi", url: "https://www.tempo.co/api/gateway/rss/free/investigasi" }
];

async function convertFeed(name, url) {
  const feed = await parser.parseURL(url);
  const items = feed.items.slice(0, 20).map(item => {
    const thumbnail = item["media:thumbnail"]?.$.url || "";
    return `
    <item>
      <title>${item.title}</title>
      <link>${item.link}</link>
      <guid>${item.guid || item.link}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description>${item.contentSnippet}</description>
      <thumbnail>${thumbnail}</thumbnail>
    </item>`;
  }).join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${feed.title}</title>
    <link>${feed.link}</link>
    <description>${feed.description}</description>
    ${items}
  </channel>
</rss>`;

  fs.writeFileSync(`free-${name}.xml`, rss.trim());
}

(async () => {
  for (const source of sources) {
    await convertFeed(source.name, source.url);
  }
})();
