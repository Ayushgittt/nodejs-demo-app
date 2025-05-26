####################################################################################
# Dockerfile for a multi-stage build to scrape data with Node.js + Puppeteer
####################################################################################
#        Stage 1: Build & Scrape with Node.js + Puppeteer  
####################################################################################
####################################################################################

FROM node:18-slim AS scraper

# Install Chromium and font libs for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN apt-get update && apt-get install -y \
      chromium \
      fonts-liberation \
      libappindicator3-1 \
      libasound2 \
      libatk-bridge2.0-0 \
      libatk1.0-0 \
      libcups2 \
      libdbus-1-3 \
      libgdk-pixbuf2.0-0 \
      libnspr4 \
      libnss3 \
      libx11-xcb1 \
      libxcomposite1 \
      libxdamage1 \
      libxrandr2 \
      xdg-utils \
    --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install

COPY scrape.js ./

# Accept the URL at build time
ARG SCRAPE_URL
ENV SCRAPE_URL=${SCRAPE_URL}

# Run the scraper to produce scraped_data.json

RUN npm start "${SCRAPE_URL}"

###############################################################################
###############################################################################
#                        Stage 2: Serve with Python + Flask 

FROM python:3.10-slim AS server

WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the scraped JSON from the previous stage
COPY --from=scraper /usr/src/app/scraped_data.json ./

COPY server.py ./

EXPOSE 5000
CMD ["python", "server.py"]