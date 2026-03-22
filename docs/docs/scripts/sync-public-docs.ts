import fs from "node:fs"
import path from "node:path"

type PromotionRule = {
  source: string
  target: string
}

const ROOT = process.cwd()
const REPO_ROOT = path.resolve(ROOT, "../..")

const promotions: PromotionRule[] = [
  {
    source: path.join(REPO_ROOT, "docs/dev/01-product/information-architecture.md"),
    target: path.join(ROOT, "content/product/information-architecture.md")
  },
  {
    source: path.join(REPO_ROOT, "docs/dev/01-product/route-map.md"),
    target: path.join(ROOT, "content/product/route-map.md")
  },
  {
    source: path.join(REPO_ROOT, "docs/dev/06-api/overview.md"),
    target: path.join(ROOT, "content/api/overview.md")
  }
]

function ensureDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
}

function promote(rule: PromotionRule) {
  if (!fs.existsSync(rule.source)) {
    console.warn(`skip: source not found: ${rule.source}`)
    return
  }

  const content = fs.readFileSync(rule.source, "utf8")
  ensureDir(rule.target)
  fs.writeFileSync(rule.target, content, "utf8")
  console.log(`promoted: ${rule.source} -> ${rule.target}`)
}

for (const rule of promotions) {
  promote(rule)
}