# 📰 Tempo RSS Converter

This project automatically fetches multiple RSS feeds from Tempo.co, processes each one to ensure compatibility with WebEngage by extracting `<media:thumbnail>` into a simplified `<thumbnail>` tag, and publishes the resulting XML files daily via GitHub Pages.

---

## ✅ Features

- Fetches and parses the following Tempo RSS feeds:
  - Cekfakta
  - Ekonomi
  - Hukum
  - Wawancara
  - Investigasi
- Converts `<media:thumbnail>` to `<thumbnail>...</thumbnail>`
- Updates daily using GitHub Actions
- Publicly accessible via GitHub Pages

---

## 📁 Output Files

These files are updated daily and publicly available:

| Feed         | XML URL |
|--------------|---------|
| Cekfakta     | [free-cekfakta.xml](https://adlandwijaka.github.io/tempo-rss/free-cekfakta.xml) |
| Ekonomi      | [free-ekonomi.xml](https://adlandwijaka.github.io/tempo-rss/free-ekonomi.xml) |
| Hukum        | [free-hukum.xml](https://adlandwijaka.github.io/tempo-rss/free-hukum.xml) |
| Wawancara    | [free-wawancara.xml](https://adlandwijaka.github.io/tempo-rss/free-wawancara.xml) |
| Investigasi  | [free-investigasi.xml](https://adlandwijaka.github.io/tempo-rss/free-investigasi.xml) |

---

## ⚙️ How It Works

- RSS feeds are fetched using `rss-parser`
- Custom `<thumbnail>` field is extracted
- Results are saved into separate `.xml` files
- GitHub Actions (`update-feed.yml`) runs daily at 12:00 PM (GMT+7)
- Files are automatically committed and published to GitHub Pages

---

## 🚀 Deployment

GitHub Pages is enabled from the root `/` of the `main` branch.  
Make sure to activate it under **Settings > Pages** for public access.

---

## ✨ License

MIT – feel free to fork, use, or improve this project.
