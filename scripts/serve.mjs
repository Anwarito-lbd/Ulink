import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const PORT = Number(process.env.PORT || 5173);
const ROOT = process.cwd();

const MIME = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".svg": "image/svg+xml",
	".png": "image/png",
};

const server = http.createServer((req, res) => {
	const reqPath = decodeURIComponent((req.url || "/").split("?")[0]);
	const relPath = reqPath === "/" ? "index.html" : reqPath.replace(/^\/+/, "");
	const filePath = path.resolve(ROOT, relPath);

	if (!filePath.startsWith(ROOT)) {
		res.writeHead(403).end("Forbidden");
		return;
	}

	fs.readFile(filePath, (err, data) => {
		if (err) {
			res.writeHead(404).end("Not found");
			return;
		}
		const ext = path.extname(filePath).toLowerCase();
		res.writeHead(200, {
			"content-type": MIME[ext] || "application/octet-stream",
		});
		res.end(data);
	});
});

server.listen(PORT, "127.0.0.1", () => {
	console.log(`uLink static server running at http://127.0.0.1:${PORT}`);
});
