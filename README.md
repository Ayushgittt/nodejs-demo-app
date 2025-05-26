# nodejs-demo-app

# 🕷️ Web Scraper with CI/CD and Security Scanning

This project is a **Node.js-based web scraper** that uses **Puppeteer** to extract data from e-commerce product listings and serves the scraped data via a **Flask API**. The entire application is containerized using Docker with a multi-stage build and deployed through a secure, automated CI/CD pipeline on GitHub Actions.

---

## 📁 Project Structure

├── scrape.js # Puppeteer script for scraping product data
├── server.py # Flask server to expose scraped data via API
├── Dockerfile # Multi-stage Dockerfile for Node + Python app
├── package.json # Node.js dependencies
├── requirements.txt # Python dependencies (Flask)
├── scraped_data.json # Output JSON from scraper
├── .github/workflows/ # GitHub Actions CI/CD workflows


---

## 🐳 Dockerfile Overview

The project uses a **multi-stage Dockerfile** to:
- Install and run the **Node.js scraper** in the first stage.
- Serve the generated JSON via a lightweight **Flask Python server** in the final stage.
- Reduce image size by separating build and runtime environments.
- Accept `SCRAPE_URL` as a build-time argument to target any scrape source dynamically.

---

## ⚙️ CI/CD Pipeline & Toolchain

The CI/CD pipeline is fully automated with **GitHub Actions**, and includes:

| Stage            | Tool/Action                              | Purpose                                 |
|------------------|-------------------------------------------|-----------------------------------------|
| Checkout         | `actions/checkout@v3`                     | Retrieves source code                   |
| Node Setup       | `actions/setup-node@v3`                   | Installs Node.js environment            |
| Testing          | `jest` (with `npm test`)                  | Validates scraper logic                 |
| Docker Build     | `docker/build-push-action@v3`             | Builds and pushes Docker image          |
| Docker Login     | `docker/login-action@v3`                  | Authenticates to DockerHub              |
| Trivy (FS)       | `aquasecurity/trivy-action@master`        | Scans source code for vulnerabilities   |
| Trivy (Image)    | `aquasecurity/trivy-action@master`        | Scans Docker image for vulnerabilities  |
| SAST             | `nodejsscan` + `upload-artifact@v4`       | Performs static application security testing |
| QEMU             | `docker/setup-qemu-action@v3`             | (Optional) Multi-arch support           |

---

## ✅ Highlights

- ✨ **Multi-stage Docker build** for minimal, secure runtime image
- 🔒 **Trivy + Nodejsscan** integrated for security scanning
- 🛠️ **Jest testing** for automated validation
- 🚀 **DockerHub deployment** via CI/CD on push to `main`
- ⚠️ CI ignores `README.md`-only commits for performance

---

## 📦 How to Build Locally

```bash
docker build \
  --build-arg SCRAPE_URL="https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops" \
  -t yourusername/web-scrapper_docker .
