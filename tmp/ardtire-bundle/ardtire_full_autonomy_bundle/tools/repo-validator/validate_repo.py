import os
import sys

REQUIRED_DIRS = [
    "apps/gov-api/src/domain",
    "apps/gov-api/src/application",
    "apps/gov-api/src/routes",
]

FORBIDDEN_PATTERNS = [
    "prisma.",
    "db.",
]


def check_directories():
    missing = [d for d in REQUIRED_DIRS if not os.path.exists(d)]
    if missing:
        print("Missing required directories:", missing)
        return False
    return True


def scan_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    for pattern in FORBIDDEN_PATTERNS:
        if pattern in content and "infrastructure" not in filepath.replace('\\', '/'):
            print(f"Violation in {filepath}: contains forbidden pattern '{pattern}'")
            return False

    return True


def scan_repo(root="."):
    ok = True
    for dirpath, _, filenames in os.walk(root):
        for filename in filenames:
            if filename.endswith(".ts"):
                full = os.path.join(dirpath, filename)
                if not scan_file(full):
                    ok = False
    return ok


if __name__ == "__main__":
    if not check_directories():
        sys.exit(1)

    if not scan_repo():
        sys.exit(1)

    print("Repo validation passed.")
