import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

function mapLayoutWriter() {
  return {
    name: "map-layout-writer",
    configureServer(server) {
      server.middlewares.use("/__save-map-layout", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("Method Not Allowed");
          return;
        }

        let body = "";
        req.setEncoding("utf8");
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", async () => {
          try {
            const layout = validateLayout(JSON.parse(body));
            const target = resolve(process.cwd(), "src/data/worldLayout.json");
            await writeFile(target, `${JSON.stringify(layout, null, 2)}\n`, "utf8");
            server.ws.send({ type: "full-reload" });
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true }));
          } catch (error) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: false, error: error.message }));
          }
        });
      });
    }
  };
}

function validateLayout(layout) {
  const places = layout?.places;
  const blockedAreas = layout?.blockedAreas;
  if (!places || typeof places !== "object" || Array.isArray(places)) throw new Error("Invalid places");
  if (!Array.isArray(blockedAreas)) throw new Error("Invalid blockedAreas");

  return {
    places: Object.fromEntries(Object.entries(places).map(([id, value]) => {
      if (!value || !Number.isFinite(value.x) || !Number.isFinite(value.y) || !Number.isFinite(value.w)) {
        throw new Error(`Invalid place: ${id}`);
      }
      return [id, { x: Math.round(value.x), y: Math.round(value.y), w: Math.round(value.w) }];
    })),
    blockedAreas: blockedAreas.map((area) => {
      if (!area || typeof area.id !== "string" || !Number.isFinite(area.x) || !Number.isFinite(area.y) || !Number.isFinite(area.w) || !Number.isFinite(area.h)) {
        throw new Error("Invalid blocked area");
      }
      return {
        id: area.id,
        name: typeof area.name === "string" ? area.name : "",
        x: Math.round(area.x),
        y: Math.round(area.y),
        w: Math.round(area.w),
        h: Math.round(area.h)
      };
    })
  };
}

export default defineConfig({
  plugins: [react(), mapLayoutWriter()],
  server: {
    host: "127.0.0.1",
    port: 5174
  }
});
