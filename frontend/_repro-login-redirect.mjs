import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();

page.on("console", (msg) => {
  if (msg.type() === "error") console.log("CONSOLE ERROR:", msg.text());
});
page.on("pageerror", (err) => {
  console.log("PAGE ERROR:", err.message);
});
page.on("response", (res) => {
  if (res.status() >= 400) console.log("HTTP", res.status(), res.url());
});

await page.goto("http://localhost:4000/login", { waitUntil: "networkidle" });
console.log("On login page:", page.url());

// Certification Body tab should be default/selected. Enter the existing test email.
await page.fill('#email', "testapplicant.saaf+qa1@gmail.com");
await page.click('button[type="submit"]');
await page.waitForTimeout(1000);

// Grab the dev-only OTP code shown on screen.
const devCodeText = await page.locator('p.font-mono.text-lg').first().textContent().catch(() => null);
console.log("Dev code shown:", devCodeText);

if (devCodeText) {
  await page.fill('#otp', devCodeText.trim());
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2500);
}

console.log("Final URL:", page.url());
const bodyText = await page.locator('body').innerText();
console.log("BODY TEXT LENGTH:", bodyText.length);
console.log("BODY TEXT SNIPPET:", bodyText.slice(0, 800));

await browser.close();
