#!/usr/bin/env bash
set -euo pipefail

# Builds the server image and scans it with Trivy. Fails on any fixable
# CRITICAL/HIGH CVE; unfixed upstream CVEs are reported but do not fail.
#
#   compose/scan.sh          scan the app image only
#   compose/scan.sh --all    also scan third-party base images we depend on

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
IMAGE="auction-proto-server:scan"

if ! command -v trivy >/dev/null 2>&1; then
  echo "trivy is not installed. Install it: https://trivy.dev/latest/getting-started/installation/"
  exit 1
fi

echo "=== Building image $IMAGE ==="
docker build -t "$IMAGE" "$ROOT_DIR"

scan_image() {
  local image="$1"
  echo "=== Trivy scan: $image ==="
  trivy image \
    --severity CRITICAL,HIGH \
    --ignore-unfixed \
    --exit-code 1 \
    "$image"
}

scan_image "$IMAGE"

if [[ "${1:-}" == "--all" ]]; then
  # Base/third-party images pinned in the build. Report only (no --exit-code)
  # since we cannot patch upstream base images ourselves.
  for base in node:22-alpine; do
    echo "=== Trivy scan (report-only): $base ==="
    trivy image --severity CRITICAL,HIGH --ignore-unfixed "$base" || true
  done
fi

echo "Image scan passed."
