# Reasoning Ledger Protocol (RLP)

**Reasoning Ledger Protocol (RLP)** is an append-only behavioral memory log for LLM agents. It defines a minimal schema and commit interface for recording, promoting, and reusing successful action patterns without retraining. RLP underlies the six-experiment empirical study in *"Promotion Without Retrieval: Gene Monopoly, Confidence Asymmetry, and the Specification-Implementation Gap in Behavioral Memory Systems"* (v11), which culminates in Experiment 6 showing the protocol crossing break-even in live deployment under calibrated decay.

[![Apache 2.0 License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![arXiv Paper](https://img.shields.io/badge/arXiv-2404.xxxxx-b31b1b.svg)](https://arxiv.org/abs/2404.xxxxx)

## Overview

The Reasoning Ledger Protocol (RLP) defines an append-only, auditable framework for recording and promoting behavioral patterns in AI systems. It enables agents to learn from experience without model retraining by capturing successful behavioral sequences as immutable "genes" with cryptographic lineage.

This repository contains the complete protocol specification, JSON Schema for commit validation, and example validation scripts. The protocol is designed to be implementation-agnostic while ensuring interoperability across different behavioral memory systems.

This public repository intentionally omits production retrieval/runtime code. It is meant to document the protocol and support the paper's claims without exposing deployment-specific implementation details.

## Academic Reference

This specification accompanies the paper:

**"Promotion Without Retrieval: Gene Monopoly, Confidence Asymmetry, and the Specification-Implementation Gap in Behavioral Memory Systems"**  
*Yannis Dominique, VDSX Cloud*  
[arXiv:2604.xxxxx](https://arxiv.org/abs/2604.xxxxx) (v11 includes Experiment 6 results)

**Post-publication validation**: The production system in Experiment 6 operated in live retrieval across 200 decisions, accumulating 23 `dna_match_valid` events (46,828 tokens saved), firing decay 11 times, and stabilizing top-gene share at 14.6%, formally crossing the break-even threshold on Jetson Orin Nano hardware without re-instantiating universal policy collapse.

## Specification

- **[reasoning-ledger-protocol-v1.0.md](reasoning-ledger-protocol-v1.0.md)** - Complete protocol documentation
- **[rlp-schema.json](rlp-schema.json)** - JSON Schema for RLP commit validation
- **[validate-example.py](validate-example.py)** - Example validation script
- **[simulate-experiments.js](simulate-experiments.js)** - Public verifier for the paper's reported metrics
- **[verify-public.sh](verify-public.sh)** - One-command public verification entrypoint

## Quick Start

### Public Verification

Readers should be able to verify two things from this repository:

1. **The protocol code works**: the schema and example commits validate successfully.
2. **The paper claims are numerically consistent**: the published break-even and experiment totals reconcile from the reported numbers.

Run:

```bash
chmod +x verify-public.sh
./verify-public.sh
```

This proves the public protocol artifacts are valid and that the paper's reported headline metrics are internally consistent. It does **not** publish the private production retrieval/runtime code used in deployment.

### Schema Validation

Validate RLP commits against the JSON Schema:

```bash
# Using Python
python3 -m json.tool your-commit.json | python3 -c "
import json, sys
from jsonschema import validate
schema = json.load(open('rlp-schema.json'))
data = json.load(sys.stdin)
validate(instance=data, schema=schema)
print('✓ Valid RLP commit')
"
```

### Basic Commit Structure

```json
{
  "rlp_version": "1.0",
  "commit_type": "gene_promotion",
  "timestamp": "2026-04-12T04:30:00Z",
  "gene": {
    "id": "research:abc123",
    "domain": "research",
    "trigger": "search for machine learning papers",
    "action": "navigate to https://arxiv.org and search",
    "evidence": {
      "first_observed": "2026-04-12T04:15:00Z",
      "success_count": 3,
      "token_savings": 2036
    }
  },
  "provenance": {
    "previous_commit": "sha256:abc123...",
    "system_fingerprint": "edge-node-001"
  }
}
```

## Architecture

RLP operates at three architectural levels:

1. **Ledger Layer** - Append-only commit storage with cryptographic hashing
2. **Promotion Layer** - Evidence-based gene promotion with economic thresholds
3. **Retrieval Layer** - Context-aware behavioral matching with domain isolation

## Use Cases

- **AI agent memory systems** - Persistent behavioral learning
- **Auditable AI operations** - Regulatory compliance and transparency
- **Multi-agent coordination** - Shared behavioral libraries
- **Edge AI deployment** - Lightweight, local memory systems

## License

Copyright 2026 VDSX Cloud

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

## Reference Implementation

MumpixDB provides the reference implementation of RLP with production-grade features including DNA runtime matching, ε-arch exploration, and action validation guards.

For commercial deployment and enterprise features, visit [mumpix.com](https://mumpix.com).

## Contributing

While the core protocol is stable, we welcome:
- Schema extensions and improvements
- Implementation feedback
- Academic collaborations
- Security audits

Please open issues for discussion before submitting major changes.
