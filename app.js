const form = document.getElementById("profileForm");
const list = document.getElementById("opportunityList");
const summary = document.getElementById("summary");
const refreshBtn = document.getElementById("refreshBtn");
const itemTemplate = document.getElementById("itemTemplate");
const dataMeta = document.getElementById("dataMeta");

let opportunities = [];
let sourceStats = {};

function normalize(v) {
	return (v || "").trim().toLowerCase();
}

function score(item, profile) {
	let s = 0;
	if (item.domain === profile.domain) s += 6;
	if (normalize(item.location).includes(normalize(profile.city))) s += 4;

	if (profile.remote === "yes") {
		if (item.remote) s += 3;
		else s -= 1;
	}

	if (profile.remote === "no") {
		if (!item.remote) s += 2;
	}

	if (profile.kind !== "all" && item.type !== profile.kind) s -= 100;

	if (/ottawa|toronto|montreal|canada/i.test(item.location)) s += 1;
	return s;
}

function getProfile() {
	const raw = localStorage.getItem("ulink-profile");
	return raw ? JSON.parse(raw) : null;
}

function setProfile(profile) {
	localStorage.setItem("ulink-profile", JSON.stringify(profile));
}

function describe(item) {
	const domainLabel = {
		software: "Software",
		ai: "AI/ML",
		data: "Data",
		cyber: "Cyber",
	};
	return `${domainLabel[item.domain] || "General"} · ${item.source}`;
}

function render(profile) {
	list.innerHTML = "";

	if (!profile) {
		summary.textContent = "Aucun profil charge.";
		return;
	}

	const ranked = opportunities
		.map((o) => ({ ...o, score: score(o, profile) }))
		.filter((o) => o.score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, 30);

	summary.textContent = `${profile.name}: ${ranked.length} opportunite(s) trouvee(s).`;

	ranked.forEach((item) => {
		const node = itemTemplate.content.cloneNode(true);
		node.querySelector(".title").textContent = item.title;
		node.querySelector(".meta").textContent =
			`${item.type.toUpperCase()} · ${item.company} · ${item.location}${item.remote ? " · Remote" : ""}`;
		node.querySelector(".desc").textContent = describe(item);
		const link = node.querySelector(".apply");
		link.href = item.url;
		link.textContent = "Postuler en 1 clic";
		list.appendChild(node);
	});
}

async function loadData() {
	try {
		const res = await fetch("./data/opportunities.json", { cache: "no-store" });
		const payload = await res.json();
		opportunities = payload.items || [];
		sourceStats = payload.sources || {};
		dataMeta.textContent = `Sources: CA ${sourceStats.canadian || 0} · AI ${sourceStats.aiJobs || 0} · Bourses ${sourceStats.scholarships || 0}`;
	} catch {
		opportunities = [];
		sourceStats = {};
		dataMeta.textContent =
			"Impossible de charger les donnees. Lance task build-data.";
	}
}

form.addEventListener("submit", (e) => {
	e.preventDefault();
	const profile = {
		name: document.getElementById("name").value.trim(),
		domain: document.getElementById("domain").value,
		city: document.getElementById("city").value.trim(),
		remote: document.getElementById("remote").value,
		kind: document.getElementById("kind").value,
	};

	setProfile(profile);
	render(profile);
});

refreshBtn.addEventListener("click", () => render(getProfile()));

(async function init() {
	await loadData();

	const p = getProfile();
	if (p) {
		document.getElementById("name").value = p.name || "";
		document.getElementById("domain").value = p.domain || "";
		document.getElementById("city").value = p.city || "";
		document.getElementById("remote").value = p.remote || "yes";
		document.getElementById("kind").value = p.kind || "all";
	}

	render(p);
})();
