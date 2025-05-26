const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const url = process.argv[2] || process.env.SCRAPE_URL;

  if (!url) {
    console.error("Please provide a URL as an argument.");
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });

  const data = await page.evaluate(() => {
    const MAX_PRODUCTS = 10; 

    const productElements = Array.from(document.querySelectorAll(".thumbnail")).slice(0, MAX_PRODUCTS);

    const products = productElements.map(el => ({
      title: el.querySelector(".title")?.innerText || "N/A",
      price: el.querySelector(".price")?.innerText || "N/A",
      description: el.querySelector(".description")?.innerText || "N/A",
      link: el.querySelector("a.title")?.getAttribute("href") || "N/A"
    }));

    return {
      scrapedFrom: document.title,
      totalProducts: products.length,
      products
    };
  });

  await browser.close();

  fs.writeFileSync("scraped_data.json", JSON.stringify(data, null, 2));
  console.log("Scraping completed. Data saved to scraped_data.json");
})();