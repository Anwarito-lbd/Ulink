import { expect, test } from "@playwright/test";

test("profile submit shows recommendations", async ({ page }) => {
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
});
