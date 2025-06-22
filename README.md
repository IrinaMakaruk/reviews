# 📱 App Store Reviews Dashboard

Live: [https://reviews-client.vercel.app](https://reviews-client.vercel.app)

A full-stack monorepo app that fetches, stores, and displays App Store reviews using a scheduled AWS Lambda function, Express API, S3 storage, and a modern React frontend.

---

## ✨ Features

- ⏬ **RSS Fetcher**: AWS Lambda function fetches reviews from Apple RSS every hour.
- ☁️ **S3 Storage**: All reviews are deduplicated and stored as a single JSON file in S3.
- 🔐 **Secure API**: Express server with API key auth to save and serve reviews.
- 💻 **Client App**: Beautiful Vite-based React UI to browse and read reviews.
- 🧹 **Code Quality**: ESLint + Prettier setup for consistent formatting.
- 🔄 **Monorepo**: Structured with [Turborepo](https://turbo.build/repo) and managed via [pnpm](https://pnpm.io).
- 🚀 **Fully Serverless**: Client on Vercel, API on Render, Lambda on AWS.
- 🛠 **Dev-friendly**: Environment-configured, strongly typed, cleanly organized.

---

## 🧱 Tech Stack

| Layer    | Stack                                                            |
| -------- | ---------------------------------------------------------------- |
| Frontend | React + Vite + Ant Design                                        |
| API      | Express.js + TypeScript                                          |
| Lambda   | Node.js 20 + RSS Fetching                                        |
| Storage  | AWS S3 JSON file                                                 |
| Infra    | Vercel (Client), Render (API), AWS Lambda (Serverless Framework) |
| Tooling  | Turborepo, ESLint, Prettier, pnpm                                |

---

## 🕒 Automation

- `fetchReviews` Lambda runs **every hour** via CloudWatch Events (cron)
- It fetches recent App Store reviews and pushes them to the API
- The API deduplicates and stores them in `reviews.json` in S3

---

## 📁 Project Structure

```
/apps
  /client               → React frontend
  /api                  → Express backend API
  /rss-fetcher-lambda   → AWS Lambda fetcher
/packages
  /models               → Shared types/models
```

## 🔐 Run Locally

```bash
pnpm install
pnpm run dev # runs API and Client
```

## 🔐 Test Locally

```bash
pnpm run test
```

# Run Lambda manually

```bash
cd packages/rss-fetcher-lambda
serverless invoke -f fetchReviews
```

## Made with ❤️ by Iryna
