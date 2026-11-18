// Добавить записи в inbox.json (зашифровано). Использование:
//   INBOX_KEY=... node tools/add.mjs '[{"title":"…","block":"work","type":"task","date":"2026-11-20"}]'
// Для удаления: [{"op":"delete","id":"…"}]
import { readFileSync, writeFileSync } from "node:fs";
import { webcrypto as c, randomBytes } from "node:crypto";
const pass = process.env.INBOX_KEY; if (!pass) throw new Error("INBOX_KEY не задан");
const items = JSON.parse(process.argv[2]);
const file = new URL("../inbox.json", import.meta.url);
const inbox = JSON.parse(readFileSync(file, "utf8"));
const base = await c.subtle.importKey("raw", new TextEncoder().encode(pass), "PBKDF2", false, ["deriveKey"]);
const key = await c.subtle.deriveKey({ name: "PBKDF2", salt: new TextEncoder().encode("organizer-inbox-v1"), iterations: 200000, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
for (const it of items) {
  if (it.op !== "delete" && !it.id) it.id = "c-" + Date.now().toString(36) + randomBytes(3).toString("hex");
  const iv = randomBytes(12);
  const ct = await c.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(JSON.stringify(it)));
  inbox.entries.push({ id: "e-" + Date.now().toString(36) + randomBytes(4).toString("hex"), iv: iv.toString("base64"), ct: Buffer.from(ct).toString("base64") });
  console.log("добавлено:", it.op || "add", it.id, it.title || "");
}
writeFileSync(file, JSON.stringify(inbox, null, 1) + "\n");
