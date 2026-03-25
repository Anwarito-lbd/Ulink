import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	use: {
		baseURL: "http://127.0.0.1:5173",
		headless: true,
	},
	webServer: {
		command: "python3 -m http.server 5173",
		url: "http://127.0.0.1:5173",
		reuseExistingServer: true,
		timeout: 120000,
	},
});
