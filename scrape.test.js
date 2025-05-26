// scrape.test.js
const fs = require("fs");

test("scraped_data.json should be valid JSON with expected structure", () => {
  const rawData = fs.readFileSync("scraped_data.json", "utf-8");
  const json = JSON.parse(rawData);

  expect(json).toHaveProperty("scrapedFrom");
  expect(json).toHaveProperty("totalProducts");
  expect(Array.isArray(json.products)).toBe(true);
  expect(json.products.length).toBeGreaterThan(0);
});
