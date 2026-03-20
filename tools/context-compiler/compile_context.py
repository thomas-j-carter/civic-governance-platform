import os

FILES = [
    "docs/ai/context/PROJECT_CONTEXT.md",
    "docs/ai/context/ARCHITECTURE_SUMMARY.md",
    "docs/ai/context/DOMAIN_MODEL.md",
    "docs/ai/context/IMPLEMENTATION_STATE.md",
    "docs/ai/context/NEXT_STEPS.md",
    "docs/ai/context/AI_RULES.md",
]

OUTPUT = "docs/ai/context/COMPILED_CONTEXT.md"

def main():
    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    with open(OUTPUT, "w", encoding="utf-8") as out:
        out.write("# COMPILED CONTEXT\n\n")
        for path in FILES:
            out.write(f"## {path}\n\n")
            if os.path.exists(path):
                with open(path, "r", encoding="utf-8") as f:
                    out.write(f.read())
                    out.write("\n\n")
            else:
                out.write("_Missing_\n\n")
    print(f"Wrote {OUTPUT}")

if __name__ == "__main__":
    main()
