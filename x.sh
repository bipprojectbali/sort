#!/usr/bin/env bun
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const CONFIG_FILE = path.join(os.homedir(), ".frpdev.conf");

interface FrpConfig {
  FRP_HOST: string;
  FRP_PORT: string;
  FRP_USER: string;
  FRP_SECRET: string;
  FRP_PROTO: string;
}

/**
 * Buat file config default kosong jika belum ada
 */
function ensureConfigFile(): void {
  if (!fs.existsSync(CONFIG_FILE)) {
    const template = `FRP_HOST="frp.wibudev.com"
FRP_PORT="443"
FRP_USER="admin"
FRP_SECRET="admin123"
FRP_PROTO="https"
`;
    fs.writeFileSync(CONFIG_FILE, template, { encoding: "utf8", mode: 0o600 });
    console.log(`⚠️  Config not found. Created template at: ${CONFIG_FILE}`);
  }
}

/**
 * Load config dari file .frpdev.conf
 */
function loadConfig(): FrpConfig {
  ensureConfigFile();

  const raw = fs.readFileSync(CONFIG_FILE, "utf8");
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);

  const conf: Record<string, string> = {};
  for (const line of lines) {
    const [key, ...rest] = line.split("=");
    if (!key) continue;
    let value = rest.join("=").trim();

    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    conf[key] = value;
  }

  return {
    FRP_HOST: conf["FRP_HOST"] || "",
    FRP_PORT: conf["FRP_PORT"] || "443",
    FRP_USER: conf["FRP_USER"] || "",
    FRP_SECRET: conf["FRP_SECRET"] || "",
    FRP_PROTO: conf["FRP_PROTO"] || "https",
  };
}

async function fetchFrp(config: FrpConfig, url: string): Promise<any> {
  const fullUrl = `${config.FRP_PROTO}://${config.FRP_HOST}:${config.FRP_PORT}${url}`;

  try {
    const resp = await fetch(fullUrl, {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${config.FRP_USER}:${config.FRP_SECRET}`).toString(
            "base64"
          ),
      },
    });

    if (!resp.ok) {
      return { proxies: [] };
    }

    const data = await resp.json();
    return data;
  } catch {
    return { proxies: [] };
  }
}

/**
 * Format array of objects jadi table string
 */
function formatTable(headers: string[], rows: string[][]): string {
  const allRows = [headers, ...rows];
  const colWidths = headers.map((_, i) =>
    Math.max(...allRows.map((row) => (row[i] || "").length))
  );

  return allRows
    .map((row, rowIndex) =>
      row
        .map((cell, i) => cell.padEnd(colWidths[i]))
        .join("  ")
        .trimEnd()
    )
    .join("\n");
}

async function main() {
  const config = loadConfig();

  const API_TCP = "/api/proxy/tcp";
  const API_HTTP = "/api/proxy/http";

  const tcpResp = await fetchFrp(config, API_TCP);
  const httpResp = await fetchFrp(config, API_HTTP);

  // ==================== TCP ====================
  console.log("========== TCP PROXIES ==========");
  const tcpHeaders = ["NAME", "STATUS", "TYPE", "PORT"];
  const tcpRows: string[][] = (tcpResp.proxies || []).map((p: any) => [
    p.name ?? "-",
    p.status ?? "-",
    p.conf?.type === "unknown" ? "" : p.conf?.type ?? "",
    p.conf?.remotePort?.toString() ?? "-",
  ]);
  console.log(formatTable(tcpHeaders, tcpRows));
  console.log();

  // ==================== HTTP ====================
  console.log("========== HTTP PROXIES ==========");
  const httpHeaders = ["NAME", "STATUS", "TYPE", "SUBDOMAIN", "CUSTOM_DOMAIN"];
  const httpRows: string[][] = (httpResp.proxies || []).map((p: any) => [
    p.name ?? "-",
    p.status ?? "-",
    p.conf?.type === "unknown" ? "" : p.conf?.type ?? "",
    p.conf?.subdomain ?? "",
    Array.isArray(p.conf?.customDomains)
      ? p.conf.customDomains.join(",")
      : "",
  ]);
  console.log(formatTable(httpHeaders, httpRows));
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
