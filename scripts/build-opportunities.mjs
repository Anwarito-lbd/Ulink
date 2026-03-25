import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const AI_REPO = path.resolve(ROOT, "../2026-AI-College-Jobs/README.md");
const CA_REPO = path.resolve(
	ROOT,
	"../Canadian-Tech-Internships-2026/README.md",
);
const OUT = path.resolve(ROOT, "data/opportunities.json");

function readIfExists(file) {
	return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function stripTags(str) {
	return str
		.replace(/<[^>]*>/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

function inferDomain(title) {
	const t = title.toLowerCase();
	if (/(ai|ml|machine learning|nlp|llm|genai|artificial intelligence)/.test(t))
		return "ai";
	if (/(data|analytics|analyst|scientist)/.test(t)) return "data";
	if (/(security|cyber)/.test(t)) return "cyber";
	return "software";
}

function splitMarkdownRow(line) {
	const cells = line.split("|").map((s) => s.trim());
	return cells.slice(1, cells.length - 1);
}

function extractMarkdownUrl(cell) {
	const outer = cell.match(/\]\((https?:\/\/[^)]+)\)\s*$/);
	if (outer) return outer[1];

	const all = [...cell.matchAll(/\((https?:\/\/[^)]+)\)/g)].map((m) => m[1]);
	if (all.length === 0) return "";
	return all[all.length - 1];
}

function extractHref(cell) {
	const m = cell.match(/href="([^"]+)"/i);
	return m ? m[1] : extractMarkdownUrl(cell);
}

function parseCanadian(readme) {
	const rows = [];
	let previousCompany = "";

	for (const line of readme.split("\n")) {
		if (!line.startsWith("|") || line.includes("|--------|")) continue;
		if (line.includes("| Company | Role | Location | Apply |")) continue;

		const cells = splitMarkdownRow(line);
		if (cells.length < 5) continue;

		let [company, role, location, applyCell, postedAt] = cells;
		company = stripTags(company);
		role = stripTags(role);
		location = stripTags(location);

		if (!company || !role || !location) continue;

		if (company === "↳") company = previousCompany;
		if (!company) continue;
		previousCompany = company;

		const url = extractMarkdownUrl(applyCell);
		if (!url) continue;

		rows.push({
			source: "canadian-tech-internships-2026",
			type: "stage",
			title: role,
			company,
			location,
			remote: /remote/i.test(location),
			domain: inferDomain(role),
			postedAt,
			url,
		});
	}

	return rows;
}

function parseAi(readme) {
	const rows = [];

	for (const line of readme.split("\n")) {
		if (!line.startsWith("| <a href=")) continue;
		const cells = splitMarkdownRow(line);
		if (cells.length < 5) continue;

		const [companyCell, roleCell, locationCell, applyCell, postedAt] = cells;
		const company = stripTags(companyCell).replace(/^\s*\*+|\*+\s*$/g, "");
		const title = stripTags(roleCell);
		const location = stripTags(locationCell);
		const url = extractHref(applyCell);

		if (!company || !title || !location || !url) continue;

		rows.push({
			source: "2026-ai-college-jobs",
			type: "stage",
			title,
			company,
			location,
			remote: /remote|work from home/i.test(location),
			domain: inferDomain(title),
			postedAt: stripTags(postedAt),
			url,
		});
	}

	return rows;
}

function buildScholarships() {
	return [
		{
			source: "ulink-curated",
			type: "bourse",
			title: "Bourse Innovation Numerique",
			company: "uOttawa",
			location: "Ottawa, ON",
			remote: true,
			domain: "software",
			postedAt: "N/A",
			url: "https://www.uottawa.ca/etudes/aide-financiere-bourses",
		},
		{
			source: "ulink-curated",
			type: "bourse",
			title: "Bourse IA et Science des Donnees",
			company: "Mitacs",
			location: "Canada",
			remote: true,
			domain: "ai",
			postedAt: "N/A",
			url: "https://www.mitacs.ca/our-programs/",
		},
	];
}

function dedupe(items) {
	const seen = new Set();
	return items.filter((item) => {
		const key = `${item.title}|${item.company}|${item.location}|${item.url}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

const aiRows = parseAi(readIfExists(AI_REPO)).slice(0, 180);
const caRows = parseCanadian(readIfExists(CA_REPO)).slice(0, 140);
const scholarshipRows = buildScholarships();

const all = dedupe([...caRows, ...aiRows, ...scholarshipRows]);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(
	OUT,
	JSON.stringify(
		{
			generatedAt: new Date().toISOString(),
			total: all.length,
			sources: {
				canadian: caRows.length,
				aiJobs: aiRows.length,
				scholarships: scholarshipRows.length,
			},
			items: all,
		},
		null,
		2,
	),
);

console.log(`Built ${all.length} opportunities -> ${OUT}`);
