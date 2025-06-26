const fs = require("fs");
const Parser = require("rss-parser");
const parser = new Parser({
  customFields: {
    item: ['media:thumbnail']
  }
});

(async () => {
  const feed = await parser.parseURL("https://www.tempo.co/api/gateway/rss/free/cekfakta");

  const items = feed.items.slice(0, 10).map(item => {
    const thumbnail = item["media:thumbnail"]?.$.url || ""; // fallback kalau tidak ada
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

  fs.writeFileSync("rss.xml", rss.trim());
})();
