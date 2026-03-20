import os
import sys

REQUIRED_DIRS = [
    "apps/gov-api/src/domain",
    "apps/gov-api/src/application",
    "apps/gov-api/src/routes",
]

def main():
    missing = [d for d in REQUIRED_DIRS if not os.path.exists(d)]
    if missing:
        print("Missing required directories:", ", ".join(missing))
        sys.exit(1)
    print("Repo validation passed.")

if __name__ == "__main__":
    main()
