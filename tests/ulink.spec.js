import { expect, test } from "@playwright/test";

test("profile submit shows recommendations and persists across reload", async ({
	page,
}) => {
	await page.goto("/");
	await page.getByLabel("Nom").fill("Anwar Issaoui");
	await page.getByLabel("Domaine").selectOption("ai");
	await page.getByLabel("Ville").fill("Ottawa");
	await page.getByLabel("Remote").selectOption("yes");
	await page.getByRole("button", { name: "Enregistrer le profil" }).click();

	await expect(
		page.getByText("opportunite(s) trouvee(s)", { exact: false }),
	).toBeVisible();
	const count = await page.locator("#opportunityList li").count();
	expect(count).toBeGreaterThan(0);

	await page.reload();
	await expect(page.getByLabel("Nom")).toHaveValue("Anwar Issaoui");
	await expect(page.locator("#opportunityList li").first()).toBeVisible();
});

test("filtering by bourses returns scholarship entries only", async ({
	page,
}) => {
	await page.goto("/");
	await page.getByLabel("Nom").fill("Student");
	await page.getByLabel("Domaine").selectOption("ai");
	await page.getByLabel("Ville").fill("Canada");
	await page.getByLabel("Remote").selectOption("any");
	await page.getByLabel("Type").selectOption("bourse");
	await page.getByRole("button", { name: "Enregistrer le profil" }).click();

	const items = page.locator("#opportunityList li");
	const count = await items.count();
	expect(count).toBeGreaterThan(0);
	for (let i = 0; i < count; i++) {
		await expect(items.nth(i).locator(".meta")).toContainText("BOURSE");
	}
});
