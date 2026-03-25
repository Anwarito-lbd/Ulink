const opportunities = [
	{
		title: "Software Engineering Intern - Backend",
		type: "stage",
		domain: "software",
		city: "Ottawa",
		remote: true,
		provider: "Nokia",
		url: "https://www.nokia.com/about-us/careers/",
		desc: "Developpement backend, APIs, tests, CI/CD.",
	},
	{
		title: "AI Research Intern",
		type: "stage",
		domain: "ai",
		city: "Toronto",
		remote: true,
		provider: "TD Bank",
		url: "https://jobs.td.com/en-CA/",
		desc: "Modeles ML, experimentation, evaluation.",
	},
	{
		title: "Bourse Excellence Numerique",
		type: "bourse",
		domain: "software",
		city: "Ottawa",
		remote: true,
		provider: "Universite",
		url: "https://www.uottawa.ca/etudes/aide-financiere-bourses",
		desc: "Aide financiere pour projets tech et recherche.",
	},
	{
		title: "Data Science Intern",
		type: "stage",
		domain: "data",
		city: "Montreal",
		remote: true,
		provider: "Airbus",
		url: "https://www.airbus.com/en/careers",
		desc: "Analyse de donnees, dashboards, experimentation.",
	},
	{
		title: "Cybersecurity Scholarship",
		type: "bourse",
		domain: "cyber",
		city: "Toronto",
		remote: false,
		provider: "Cyber Foundation",
		url: "https://www.cyber.gc.ca/",
		desc: "Bourse orientee securite et resilience numerique.",
	},
];

const form = document.getElementById("profileForm");
const list = document.getElementById("opportunityList");
const summary = document.getElementById("summary");
const refreshBtn = document.getElementById("refreshBtn");
const itemTemplate = document.getElementById("itemTemplate");

function normalize(v) {
	return (v || "").trim().toLowerCase();
}

function score(item, profile) {
	let s = 0;
	if (item.domain === profile.domain) s += 5;
	if (normalize(item.city) === normalize(profile.city)) s += 3;
	if (profile.remote === "yes" && item.remote) s += 2;
	if (profile.remote === "no" && !item.remote) s += 2;
	return s;
}

function getProfile() {
	const raw = localStorage.getItem("ulink-profile");
	return raw ? JSON.parse(raw) : null;
}

function setProfile(profile) {
	localStorage.setItem("ulink-profile", JSON.stringify(profile));
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
		.sort((a, b) => b.score - a.score);

	summary.textContent = `${profile.name}: ${ranked.length} opportunite(s) trouvee(s).`;

	ranked.forEach((item) => {
		const node = itemTemplate.content.cloneNode(true);
		node.querySelector(".title").textContent = item.title;
		node.querySelector(".meta").textContent =
			`${item.type.toUpperCase()} · ${item.provider} · ${item.city}${item.remote ? " · Remote" : ""}`;
		node.querySelector(".desc").textContent = item.desc;
		const link = node.querySelector(".apply");
		link.href = item.url;
		link.textContent = "Postuler en 1 clic";
		list.appendChild(node);
	});
}

form.addEventListener("submit", (e) => {
	e.preventDefault();
	const profile = {
		name: document.getElementById("name").value.trim(),
		domain: document.getElementById("domain").value,
		city: document.getElementById("city").value.trim(),
		remote: document.getElementById("remote").value,
	};

	setProfile(profile);
	render(profile);
});

refreshBtn.addEventListener("click", () => render(getProfile()));

(function init() {
	const p = getProfile();
	if (p) {
		document.getElementById("name").value = p.name || "";
		document.getElementById("domain").value = p.domain || "";
		document.getElementById("city").value = p.city || "";
		document.getElementById("remote").value = p.remote || "yes";
	}
	render(p);
})();
