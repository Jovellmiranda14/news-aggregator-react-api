---

# 📰 News Aggregator React API

A lightweight backend API for the [News Aggregator React App](https://github.com/Jovellmiranda/news-aggregator-react), responsible for fetching and relaying news content from external sources.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Jovellmiranda/news-aggregator-react-api.git
cd news-aggregator-react-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root and add your News API key:

```
NEWS_API_KEY=your_news_api_key_here
BASE_URL=https://newsapi.org/v2
```

### 4. Run Locally with Vercel CLI

Make sure you have the Vercel CLI installed:

```bash
npm install -g vercel
```

Then run the development server:

```bash
vercel dev
```

By default, your local API will be available at `http://localhost:3000/api`.

---

## 🗂️ Folder Structure

```
news-aggregator-react-api/
├── api/                   # API routes (Edge Functions)
│   ├── api.js             # Handles fetching of general/top headlines
│   └── article.js         # Handles article-specific fetching logic
├── .env                   # Environment variables
├── vercel.json            # Vercel configuration (if used)
└── README.md              # Project documentation
```

---

## 📬 Sample Postman Requests

| Endpoint               | Method | Description                       | Query Params                                  | Example URL                                                             |
|------------------------|--------|-----------------------------------|------------------------------------------------|-------------------------------------------------------------------------|
| `/api/api`             | GET    | Fetch top headlines               | `category`, `country`                         | `http://localhost:3000/api/api?category=technology&country=us`         |
| `/api/article`         | GET    | Search articles by keyword        | `q` (required)                                 | `http://localhost:3000/api/article?q=climate+change`                   |

### 🔹 Headers (for both endpoints)
```json
{
  "Content-Type": "application/json"
}
```


---

## 🧩 Related Repositories

| Name                      | Description                              | Link                                                                 |
|---------------------------|------------------------------------------|----------------------------------------------------------------------|
| Frontend (React App)      | News Aggregator client using News API     | [news-aggregator-react](https://github.com/Jovellmiranda/news-aggregator-react) |
| Backend (This Repo)       | Handles requests to the News API          | [news-aggregator-react-api](https://github.com/Jovellmiranda/news-aggregator-react-api) |

