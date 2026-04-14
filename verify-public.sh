#!/usr/bin/env bash
set -euo pipefail

echo "== RLP public verification =="
echo
echo "1. Validating protocol schema examples"
python3 validate-example.py
echo
echo "2. Checking published paper metrics for internal consistency"
node simulate-experiments.js
echo
echo "Verification complete."
