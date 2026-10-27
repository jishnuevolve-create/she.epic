import { test, expect } from "@playwright/test";
test("homepage and navigation work without horizontal overflow", async ({ page, isMobile }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Some moments");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  if (isMobile && (page.viewportSize()?.width || 0) <= 700) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "Our stories" })
      .click();
  } else {
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Our stories" })
      .click();
  }
  await expect(page).toHaveURL(/portfolio$/);
});
test("filters, story detail and accessible lightbox work", async ({ page }) => {
  await page.goto("/portfolio");
  await page.getByRole("button", { name: "Weddings", exact: true }).click();
  await expect(page.locator(".story-card")).toHaveCount(1);
  await page.getByRole("link", { name: "A day to remember", exact: true }).click();
  await page
    .getByRole("button", { name: /Open photograph/ })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByText("2 / 2")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
test("booking validates and handles a controlled successful request", async ({ page }) => {
  await page.route("**/api/availability?*", (route) =>
    route.fulfill({
      json: {
        timezone: "Asia/Kolkata",
        slots: [
          { date: "2099-01-10", start_at: "2099-01-10T06:00:00Z", end_at: "2099-01-10T06:30:00Z" },
        ],
      },
    }),
  );
  await page.route("**/api/appointments", (route) =>
    route.fulfill({ status: 201, json: { message: "Saved test fixture" } }),
  );
  await page.goto("/book-consultation");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("alert").first()).toBeVisible();
  await page.getByLabel("Your name").fill("Test Couple");
  await page.getByLabel("Email address").fill("test@example.com");
  await page.getByLabel("Phone / WhatsApp").fill("+91 98765 43210");
  await page.getByLabel("Event date", { exact: true }).fill("2099-02-01");
  await page.getByLabel("Event location").fill("Test venue");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Consultation month").fill("2099-01");
  await page.getByRole("button", { name: "2099-01-10", exact: true }).click();
  await page.getByRole("button", { name: /11:30/ }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: "Your story starts here." })).toBeVisible();
  await expect(page.getByRole("button", { name: "2099-01-09", exact: true })).not.toBeVisible();
  await page.getByRole("button", { name: /Request consultation/ }).click();
  await expect(
    page.getByText("Your consultation request has been received.", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByText("This is a pending request, not a confirmed appointment."),
  ).toBeVisible();
});
test("contact submission displays controlled persistence response", async ({ page }) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 201,
      json: { message: "Your message has been received by the studio." },
    }),
  );
  await page.goto("/contact");
  await page.getByLabel("Your name").fill("Test Person");
  await page.getByLabel("Email address").fill("test@example.com");
  await page.getByLabel("Your message").fill("Please tell us about your wedding coverage.");
  await page.getByRole("button", { name: /Send your note/ }).click();
  await expect(page.getByRole("status")).toContainText("received");
});
test("unconfigured backend never claims a real booking success", async ({ request }) => {
  const response = await request.post("/api/appointments", {
    headers: { origin: "http://localhost:3000" },
    data: {},
  });
  expect([422, 503]).toContain(response.status());
  expect(await response.json()).toHaveProperty("error");
});
test("responsive pages and screenshot evidence", async ({ page }, info) => {
  await page.goto("/");
  await expect(page.locator(".hero")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (let y = 0; y < (await page.locator("body").evaluate((el) => el.scrollHeight)); y += 650) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(100);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: info.outputPath("home.png"), fullPage: true });
  for (const path of ["/about", "/services", "/films", "/contact", "/book-consultation"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
});
