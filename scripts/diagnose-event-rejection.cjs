/**
 * Temporary diagnostic (v2): verify the authenticated pages render their
 * content and capture the real reason behind any "[object Event]"
 * unhandled rejection reported by the Next dev overlay.
 */
const { chromium } = require("@playwright/test");

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const findings = [];
  const hook = (label) => `
    window.addEventListener("unhandledrejection", (event) => {
      const reason = event.reason;
      console.error("${label}", JSON.stringify({
        ctor: reason && reason.constructor ? reason.constructor.name : String(reason),
        message: reason && reason.message,
        stack: reason && reason.stack ? String(reason.stack).slice(0, 1200) : undefined,
        detail: (() => { try { return JSON.stringify(reason, Object.getOwnPropertyNames(reason || {})); } catch { return String(reason); } })(),
      }));
    });`;

  await page.addInitScript(hook("[UR]"));
  page.on("console", (msg) => {
    const text = msg.text();
    if (text.startsWith("[UR]")) findings.push(text);
  });
  page.on("pageerror", (err) => findings.push(`[PAGEERROR] ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") findings.push(`[CONSOLE_ERROR] ${msg.text().slice(0, 500)}`);
  });
  page.on("response", async (res) => {
    if (res.status() === 401 && res.url().includes("localhost:3001")) {
      const body = await res.text().catch(() => "<no body>");
      findings.push(`[401-BODY] ${res.url()} → ${body.slice(0, 200)}`);
    }
    if (res.status() === 404 && res.url().startsWith("http://localhost")) {
      findings.push(`[404] ${res.url()}`);
    }
  });

  // Login — wait for hydration (submit button enables) before typing so
  // the controlled inputs keep their values.
  await page.goto("http://localhost:3002/login", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("button[type=submit]:not([disabled])", { timeout: 30000 });
  await page.fill("input[type=email]", "superadmin@hitsanat.org");
  await page.fill("input[type=password]", "password123");
  await page.click("button[type=submit]");
  await page.waitForURL((u) => !u.pathname.includes("login"), { timeout: 30000 }).catch(() => {});
  console.log("after login →", page.url());
  const cookieNames = (await context.cookies("http://localhost:3001"))
    .map((c) => `${c.name}(${c.value.length} chars)`)
    .join(", ");
  console.log("cookies seen by the API origin:", cookieNames || "<none>");
  if (page.url().includes("login")) {
    const formText = await page
      .locator("form")
      .innerText()
      .catch(() => "<form not found>");
    console.log("form text:", formText.replace(/\s+/g, " ").slice(0, 300));
  }

  const checks = [
    ["/super-admin", ["Super Admin Dashboard", "Deactivated Accounts", "Leadership Posts"]],
    ["/users", ["User Accounts", "Create account"]],
    ["/audit-logs", ["Audit Logs", "Export CSV"]],
  ];

  for (const [route, markers] of checks) {
    await page.goto(`http://localhost:3002${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(6000);
    const bodyText = await page.locator("body").innerText();
    const found = markers.map((m) => `${m}=${bodyText.includes(m)}`);
    console.log(`${route} → ${page.url()} | ${found.join(", ")}`);
    console.log(`  body excerpt: ${bodyText.replace(/\s+/g, " ").slice(0, 400)}`);
  }

  console.log("\n######## FINDINGS ########");
  console.log(findings.length === 0 ? "No unhandled rejections captured." : "");
  for (const f of findings) {
    console.log(f, "\n----");
  }

  await browser.close();
})();
