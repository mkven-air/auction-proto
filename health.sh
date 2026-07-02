#!/usr/bin/env bash
set -euo pipefail

export PNPM_CONFIG_TRUST_LOCKFILE=true

GITLEAKS_BIN=""
TMP_DIR=""

cleanup() {
  if [[ -n "$TMP_DIR" && -d "$TMP_DIR" ]]; then
    rm -rf "$TMP_DIR"
  fi
}
trap cleanup EXIT

if command -v gitleaks >/dev/null 2>&1; then
  GITLEAKS_BIN="$(command -v gitleaks)"
else
  TMP_DIR="$(mktemp -d)"
  API_URL="https://api.github.com/repos/gitleaks/gitleaks/releases/latest"
  TARBALL_URL="$(curl -fsSL "$API_URL" | grep browser_download_url | grep linux_x64.tar.gz | head -n 1 | cut -d '"' -f 4)"
  if [[ -z "$TARBALL_URL" ]]; then
    echo "Could not resolve a gitleaks release tarball URL"
    exit 1
  fi
  curl -fsSL "$TARBALL_URL" -o "$TMP_DIR/gitleaks.tar.gz"
  tar -xzf "$TMP_DIR/gitleaks.tar.gz" -C "$TMP_DIR"
  GITLEAKS_BIN="$TMP_DIR/gitleaks"
fi

echo "=== Gitleaks (working tree) ==="
"$GITLEAKS_BIN" dir . --redact --no-banner

echo "=== Gitleaks (git history) ==="
"$GITLEAKS_BIN" git --redact --no-banner

echo "=== Outdated dependencies ==="
OUTDATED_JSON="$(pnpm outdated --recursive --format json || true)"
TRIMMED="$(echo "$OUTDATED_JSON" | tr -d '[:space:]')"
if [[ -n "$TRIMMED" && "$TRIMMED" != "[]" && "$TRIMMED" != "{}" ]]; then
  echo "Outdated dependencies found:"
  echo "$OUTDATED_JSON"
  exit 1
fi

echo "=== Vulnerability audit ==="
pnpm audit --audit-level high

echo "=== Docker image scan (Trivy) ==="
if ! command -v trivy >/dev/null 2>&1; then
  echo "trivy is not installed. Install it: https://trivy.dev/latest/getting-started/installation/"
  exit 1
fi
bash compose/scan.sh

echo "Health checks passed."
