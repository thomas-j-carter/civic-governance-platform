import os

OUTPUT_FILE = "docs/ai/context/COMPILED_CONTEXT.md"

FILES = [
    "docs/ai/context/PROJECT_CONTEXT.md",
    "docs/ai/context/ARCHITECTURE_SUMMARY.md",
    "docs/ai/context/DOMAIN_MODEL.md",
    "docs/ai/context/IMPLEMENTATION_STATE.md",
    "docs/ai/context/NEXT_STEPS.md",
    "docs/ai/context/AI_RULES.md",
]

def read_file(path):
    if not os.path.exists(path):
        return f"\n## Missing: {path}\n"
    with open(path, "r", encoding="utf-8") as f:
        return f"\n## {path}\n\n{f.read()}\n"

def compile_context():
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        out.write("# COMPILED CONTEXT\n\n")
        for f in FILES:
            out.write(read_file(f))

if __name__ == "__main__":
    compile_context()
    print(f"Compiled context to {OUTPUT_FILE}")
