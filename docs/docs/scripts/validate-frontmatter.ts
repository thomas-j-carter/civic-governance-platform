import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const CONTENT_ROOT = path.join(ROOT, "content")

const required = ["title"]

function walk(dir: string): string[] {
  const out: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else if (entry.isFile() && full.endsWith(".md")) out.push(full)
  }
  return out
}

function parseFrontmatter(src: string): Record<string, string> {
  if (!src.startsWith("---")) return {}
  const end = src.indexOf("\n---", 3)
  if (end === -1) return {}
  const raw = src.slice(4, end).trim()
  const result: Record<string, string> = {}
  for (const line of raw.split("\n")) {
    const idx = line.indexOf(":")
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    result[key] = value
  }
  return result
}

const files = walk(CONTENT_ROOT)
let failed = false

for (const file of files) {
  const src = fs.readFileSync(file, "utf8")
  const fm = parseFrontmatter(src)
  for (const key of required) {
    if (!fm[key]) {
      console.error(`missing "${key}" in ${path.relative(ROOT, file)}`)
      failed = true
    }
  }
}

if (failed) process.exit(1)
console.log(`validated ${files.length} markdown files`)