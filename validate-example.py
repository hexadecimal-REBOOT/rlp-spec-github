#!/usr/bin/env python3
"""
Validate RLP schema against example commits.
"""

import json
import sys
from jsonschema import validate, ValidationError

def load_schema():
    """Load the RLP JSON Schema."""
    with open('rlp-schema.json', 'r') as f:
        return json.load(f)

def load_example(filename):
    """Load an example commit."""
    with open(filename, 'r') as f:
        return json.load(f)

def validate_commit(schema, commit):
    """Validate a commit against the schema."""
    try:
        validate(instance=commit, schema=schema)
        print(f"✓ Valid RLP commit")
        return True
    except ValidationError as e:
        print(f"✗ Validation error: {e.message}")
        print(f"  Path: {e.json_path}")
        return False

def main():
    """Main validation function."""
    print("RLP Schema Validator")
    print("=" * 50)
    validation_failed = False
    
    # Load schema
    try:
        schema = load_schema()
        print("✓ Schema loaded successfully")
    except Exception as e:
        print(f"✗ Error loading schema: {e}")
        return 1
    
    # Validate schema examples
    print("\nValidating schema examples:")
    print("-" * 30)
    
    examples = schema.get('examples', [])
    for i, example in enumerate(examples, 1):
        if not isinstance(example, dict):
            print(f"\nExample {i}: skipped (non-object schema example)")
            continue
        if 'rlp_version' not in example or 'commit_type' not in example:
            print(f"\nExample {i}: skipped (not a complete RLP commit example)")
            continue

        print(f"\nExample {i}: {example.get('commit_type', 'unknown')}")
        if validate_commit(schema, example):
            print(f"  Type: {example.get('commit_type')}")
            if 'gene' in example:
                print(f"  Gene: {example['gene'].get('id', 'unknown')}")
            if 'execution' in example:
                print(f"  Decision: {example['execution'].get('decision_source', 'unknown')}")
        else:
            validation_failed = True
    
    # Create and validate a simple test commit
    print("\nCreating test commit:")
    print("-" * 30)
    
    test_commit = {
        "rlp_version": "1.0",
        "commit_type": "execution_record",
        "timestamp": "2024-04-08T05:00:00Z",
        "execution": {
            "decision_source": "dna_gene",
            "metric_bucket": "dna_match_valid",
            "gene_id": "research:test123",
            "domain": "research",
            "saved_tokens": 2036,
            "confidence": 0.9,
            "match_threshold": 0.3
        },
        "provenance": {
            "previous_commit": "sha256:test123",
            "commit_hash": "sha256:test456",
            "system_fingerprint": "test-system",
            "agent_version": "1.0.0",
            "ledger_depth": 1
        }
    }
    
    print(f"Test commit: {test_commit['commit_type']}")
    if validate_commit(schema, test_commit):
        print("✓ Test commit is valid")
    else:
        validation_failed = True
    
    print("\n" + "=" * 50)
    print("Validation complete")
    return 1 if validation_failed else 0

if __name__ == "__main__":
    sys.exit(main())
