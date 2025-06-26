const Parser = require('rss-parser');
const fs = require('fs');
const parser = new Parser();

async function generateFeed(name, url) {
  const feed = await parser.parseURL(url);

  // Sort items by pubDate DESCENDING
  const items = feed.items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  // Generate XML with incremental ID as guid
  const xmlItems = items.map((item, index) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid>${index + 1}</guid>
      <pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>
      <description>${escapeXml(item.contentSnippet || '')}</description>
      <thumbnail>${extractThumbnail(item)}</thumbnail>
    </item>`).join('');

  const output = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(feed.title)}</title>
    <link>${feed.link}</link>
    <description>${escapeXml(feed.description)}</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>id-ID</language>
    ${xmlItems}
  </channel>
</rss>`;

  fs.writeFileSync(`free-${name}.xml`, output);
}

// Replace with actual image logic from media:thumbnail
function extractThumbnail(item) {
  if (item.enclosure?.url) return item.enclosure.url;
  if (item['media:thumbnail']?.$?.url) return item['media:thumbnail'].$.url;
  return '';
}

// Escape XML characters
function escapeXml(unsafe) {
  return unsafe?.replace(/[<>&'"]/g, function (c) {
    return { '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c];
  }) || '';
}

// List of feeds
const feeds = {
  cekfakta: 'https://www.tempo.co/api/gateway/rss/free/cekfakta',
  ekonomi: 'https://www.tempo.co/api/gateway/rss/free/ekonomi',
  hukum: 'https://www.tempo.co/api/gateway/rss/free/hukum',
  wawancara: 'https://www.tempo.co/api/gateway/rss/free/wawancara',
  investigasi: 'https://www.tempo.co/api/gateway/rss/free/investigasi',
};

(async () => {
  for (const [name, url] of Object.entries(feeds)) {
    await generateFeed(name, url);
    console.log(`✅ Generated free-${name}.xml`);
  }
})();
