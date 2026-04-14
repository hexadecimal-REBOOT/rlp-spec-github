# Reasoning Ledger Protocol v1.0

## Abstract

The Reasoning Ledger Protocol (RLP) defines an append-only, auditable framework for recording behavioral patterns in AI systems. It enables agents to learn from experience without model retraining by capturing successful behavioral sequences as immutable "genes" with cryptographic lineage. This document specifies the protocol schema, commit structure, and operational semantics.

## 1. Introduction

### 1.1 Purpose

RLP provides a standardized method for AI systems to:
- Record behavioral patterns with full provenance
- Promote successful patterns based on evidence thresholds
- Enable auditability without requiring access to originating systems
- Support economic viability analysis through token cost tracking

### 1.2 Design Principles

1. **Immutability** - Once committed, records cannot be altered
2. **Provenance** - Full cryptographic lineage for all behavioral patterns
3. **Economic Viability** - Built-in cost analysis for behavioral reuse
4. **Domain Isolation** - Multi-level scoping for behavioral patterns
5. **Standardization** - JSON-based schema for interoperability

## 2. Protocol Architecture

### 2.1 Three-Layer Model

```
┌─────────────────────────────────────────────┐
│              Retrieval Layer                │
│  • Context-aware matching                   │
│  • Domain isolation                         │
│  • Confidence scoring                       │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│              Promotion Layer                │
│  • Evidence accumulation                    │
│  • Economic threshold checking              │
│  • Gene lifecycle management                │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│               Ledger Layer                  │
│  • Append-only storage                      │
│  • Cryptographic hashing                    │
│  • Schema validation                        │
└─────────────────────────────────────────────┘
```

### 2.2 Core Components

- **Gene** - A behavioral pattern with trigger, action, and domain
- **Commit** - An immutable record in the ledger
- **Evidence** - Success metrics supporting gene promotion
- **Provenance** - Cryptographic lineage tracking
- **Domain** - Behavioral scope (research, navigation, etc.)

## 3. Commit Schema

### 3.1 Base Commit Structure

All RLP commits MUST follow this JSON structure:

```json
{
  "rlp_version": "string",
  "commit_type": "string",
  "timestamp": "ISO8601",
  "gene": { ... },
  "evidence": { ... },
  "provenance": { ... },
  "metadata": { ... }
}
```

### 3.2 Commit Types

| Type | Description | Required Fields |
|------|-------------|-----------------|
| `gene_promotion` | Promotion of a behavioral pattern to active gene | `gene`, `evidence` |
| `execution_record` | Record of behavioral execution | `execution`, `decision_source` |
| `system_event` | System-level event (startup, error, etc.) | `event_type`, `event_data` |
| `economic_record` | Token cost/savings tracking | `tokens_used`, `tokens_saved` |

### 3.3 Gene Structure

```json
{
  "gene": {
    "id": "string",
    "locus": "string",
    "domain": "string",
    "trigger": "string",
    "action": "string",
    "type": "do|think|check",
    "promoted": "boolean",
    "confidence": "number",
    "usage_count": "integer"
  }
}
```

**Field Definitions:**
- `id` - Unique gene identifier (e.g., "research:abc123")
- `locus` - Human-readable identifier (e.g., "research:search papers:navigate to arxiv")
- `domain` - Behavioral domain (e.g., "research", "navigation")
- `trigger` - Context that triggers this behavior
- `action` - Executable action or thought process
- `type` - Gene type: "do" (action), "think" (reasoning), "check" (verification)
- `promoted` - Whether gene is actively promoted
- `confidence` - Match confidence score (0.0-1.0)
- `usage_count` - Number of times successfully used

### 3.4 Evidence Structure

```json
{
  "evidence": {
    "first_observed": "ISO8601",
    "last_observed": "ISO8601",
    "success_count": "integer",
    "failure_count": "integer",
    "token_savings": "integer",
    "average_tokens_saved": "number",
    "promotion_threshold": "integer"
  }
}
```

### 3.5 Provenance Structure

```json
{
  "provenance": {
    "previous_commit": "string",
    "commit_hash": "string",
    "system_fingerprint": "string",
    "agent_version": "string",
    "ledger_depth": "integer"
  }
}
```

### 3.6 Execution Record Structure

```json
{
  "execution": {
    "decision_source": "string",
    "metric_bucket": "string",
    "gene_id": "string",
    "domain": "string",
    "saved_tokens": "integer",
    "confidence": "number",
    "match_threshold": "number",
    "failure_reason": "string"
  }
}
```

**Decision Sources:**
- `dna_gene` - DNA runtime match with valid action
- `dna_gene_invalid_action` - DNA match with invalid/empty action
- `dna_PREFER__` - ε-greedy exploration pathway
- `llm_fallback` - LLM fallback decision
- `llm_forced_exploration` - Forced LLM exploration

**Metric Buckets:**
- `dna_match_valid` - Valid DNA match with executable action
- `dna_match_invalid_action` - DNA match with invalid action (Gap #10)
- `dna_PREFER__` - ε-greedy exploration active
- `llm_fallback` - Clean LLM fallback

## 4. Operational Semantics

### 4.1 Gene Promotion

A gene is promoted when:
1. **Evidence threshold** - `success_count ≥ promotion_threshold`
2. **Economic viability** - `token_savings ≥ cost_of_promotion`
3. **Domain relevance** - Gene operates within allowed domain scope
4. **Action validity** - Action field is non-empty and parseable

Promotion threshold defaults to 3 successful executions.

### 4.2 Economic Viability

**Break-even Analysis:**
```
cost_per_gene = average_token_cost_of_promotion
tokens_saved_per_use = average_tokens_saved
break_even_reuses = ceil(cost_per_gene / tokens_saved_per_use)
```

Default: `cost_per_gene = 6,100 tokens`, `tokens_saved_per_use = 2,036 tokens`
Result: `break_even_reuses = 3`

### 4.3 Domain Isolation

Domains provide behavioral scoping:
- **Universal** - Cross-domain behaviors (e.g., navigation)
- **Research** - Academic paper search and analysis
- **Navigation** - Browser and application navigation
- **Analysis** - Data processing and interpretation

Clients MUST respect domain isolation by filtering gene matches to requested domains.

### 4.4 Action Validation

Before crediting behavioral reuse, systems MUST validate:
1. **Non-empty action** - Action field contains executable content
2. **Parseability** - Action can be parsed into executable commands
3. **Executability** - Action can be executed in current context

Invalid actions MUST be logged as `dna_match_invalid_action` with 0 tokens credited.

## 5. Audit Log Format

### 5.1 Audit Log Structure

RLP implementations SHOULD maintain an append-only audit log for durability:

```
audit-log.ndjson
```

Each line contains a complete JSON commit:

```json
{"ts": 1775639397809, "type": "execution_record", "execution": {...}}
{"ts": 1775639398572, "type": "execution_record", "execution": {...}}
{"ts": 1775639398576, "type": "promotion_record", "gene_id": "...", ...}
```

### 5.2 Audit Log Fields

- `ts` - Timestamp in milliseconds since epoch
- `type` - Commit type (execution_record, promotion_record, etc.)
- Additional fields per commit type

## 6. Transport and Runtime Boundaries

RLP is a protocol and schema specification. Transport, APIs, storage layout, and runtime orchestration are intentionally left implementation-specific and are out of scope for this public document.

## 7. Failure Modes Taxonomy

RLP implementations should monitor for these failure modes:

1. **Promotion-Retrieval Orthogonality** - Genes promoted but never retrieved
2. **Universal Gene Monopoly** - Single universal gene captures all decisions
3. **Confidence Asymmetry** - High-usage genes dominate low-usage ones
4. **Specification-Implementation Gap** - Interface promise vs. runtime behavior mismatch
5. **Domain Isolation Collapse** - Isolation eliminates monopoly but forces 100% fallback
6. **Economic Viability Threshold** - Break-even requires ≥3 reuses per gene
7. **ε=0 Learning Deadlock** - Perfect retrieval inhibits new promotions
8. **Metric Integrity Failure** - Single bucket hides outcome diversity
9. **Promotion Guard Missing** - Empty actions accepted into runtime
10. **Action Deserialization Failure** - Empty/malformed actions credited as reuse (Gap #10)
11. **Confidence Decay Miscalibration** - Anti-monopoly threshold set below natural baseline suppresses healthy specialization (Gap #11)

## 8. Security Considerations

### 8.1 Cryptographic Integrity

- All commits SHOULD include cryptographic hashes of previous commits
- Implementations SHOULD verify hash chains on ledger replay
- External auditors SHOULD be able to verify ledger integrity without runtime access

### 8.2 Action Sanitization

- Actions MUST be sanitized before execution
- Implementations SHOULD validate action syntax before promotion
- Malformed actions MUST NOT receive behavioral reuse credit

### 8.3 Privacy Considerations

- Behavioral patterns MAY contain sensitive information
- Implementations SHOULD provide data anonymization options
- Production deployments SHOULD implement access controls

## 9. Compliance

### 9.1 Schema Compliance

Implementations MUST:
- Validate all commits against the JSON Schema
- Reject commits with invalid or missing required fields
- Maintain backward compatibility within major versions

### 9.2 Economic Compliance

Implementations SHOULD:
- Track token costs and savings accurately
- Enforce break-even thresholds before gene promotion
- Provide audit trails for economic decisions

## 10. Versioning

### 10.1 Protocol Versioning

- Major versions (1.x, 2.x) - Breaking changes
- Minor versions (1.1, 1.2) - Backward-compatible additions
- Patch versions (1.0.1, 1.0.2) - Bug fixes only

### 10.2 Backward Compatibility

RLP v1.0 implementations MUST:
- Accept all v1.x commits
- Reject commits with unsupported `rlp_version`
- Provide migration paths for major version upgrades

## 11. References

1. Dominique, Y. "Promotion Without Retrieval: Gene Monopoly, Confidence Asymmetry, and the Specification-Implementation Gap in Behavioral Memory Systems." arXiv:2604.xxxxx (2026)
2. JSON Schema specification: https://json-schema.org/
3. ISO 8601 Date and Time Format: https://www.iso.org/iso-8601-date-and-time-format.html

## Appendix A: JSON Schema

See [rlp-schema.json](rlp-schema.json) for complete JSON Schema definition.

## Appendix B: Example Commits

### B.1 Gene Promotion

```json
{
  "rlp_version": "1.0",
  "commit_type": "gene_promotion",
  "timestamp": "2026-04-12T04:30:00Z",
  "gene": {
    "id": "research:abc123",
    "locus": "research:search for machine learning papers:navigate to https://arxiv.org and search",
    "domain": "research",
    "trigger": "search for machine learning papers",
    "action": "navigate to https://arxiv.org and search for \"machine learning\"",
    "type": "do",
    "promoted": true,
    "confidence": 0.9,
    "usage_count": 0
  },
  "evidence": {
    "first_observed": "2026-04-12T04:15:00Z",
    "last_observed": "2026-04-12T04:25:00Z",
    "success_count": 3,
    "failure_count": 0,
    "token_savings": 6108,
    "average_tokens_saved": 2036,
    "promotion_threshold": 3
  },
  "provenance": {
    "previous_commit": "sha256:abc123def456",
    "commit_hash": "sha256:def456abc123",
    "system_fingerprint": "edge-node-001",
    "agent_version": "1.0.0",
    "ledger_depth": 1525
  },
  "metadata": {
    "experiment_id": "public-example",
    "epsilon_arch": 0.2,
    "monopoly_brakes": true
  }
}
```

### B.2 Execution Record (Valid Match)

```json
{
  "rlp_version": "1.0",
  "commit_type": "execution_record",
  "timestamp": "2026-04-12T04:31:00Z",
  "execution": {
    "decision_source": "dna_gene",
    "metric_bucket": "dna_match_valid",
    "gene_id": "research:abc123",
    "domain": "research",
    "saved_tokens": 2036,
    "confidence": 0.9,
    "match_threshold": 0.3,
    "failure_reason": null
  },
  "provenance": {
    "previous_commit": "sha256:def456abc123",
    "commit_hash": "sha256:ghi789def456",
    "system_fingerprint": "edge-node-001",
    "agent_version": "1.0.0",
    "ledger_depth": 1526
  }
}
```

### B.3 Execution Record (Invalid Action - Gap #10)

```json
{
  "rlp_version": "1.0",
  "commit_type": "execution_record",
  "timestamp": "2026-04-12T04:32:00Z",
  "execution": {
    "decision_source": "dna_gene_invalid_action",
    "metric_bucket": "dna_match_invalid_action",
    "gene_id": "dna_match_1775639397809",
    "domain": "research",
    "saved_tokens": 0,
    "confidence": 0.9,
    "match_threshold": 0.3,
    "failure_reason": "EMPTY_OR_INVALID_ACTION"
  },
  "provenance": {
    "previous_commit": "sha256:ghi789def456",
    "commit_hash": "sha256:jkl012ghi789",
    "system_fingerprint": "edge-node-001",
    "agent_version": "1.0.0",
    "ledger_depth": 1527
  }
}
```

---

**Copyright 2026 VDSX Cloud**  
**License: Apache 2.0**  
**Version: 1.0.0**  
**Date: April 2026**
