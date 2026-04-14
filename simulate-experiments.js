#!/usr/bin/env node
/**
 * simulate-experiments.js
 * Public-facing paper verifier for the RLP repository.
 *
 * This file intentionally avoids publishing production retrieval logic,
 * ranking code, decay mechanics, or runtime architecture. It only checks
 * that the public numerical claims in the paper are internally consistent.
+ *
 * Run: node simulate-experiments.js
 */

'use strict';

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const pass = (s) => `${C.green}PASS${C.reset} ${s}`;
const fail = (s) => `${C.red}FAIL${C.reset} ${s}`;
const head = (s) =>
  `\n${C.bold}${C.blue}${'-'.repeat(64)}\n${s}\n${'-'.repeat(64)}${C.reset}`;
const info = (s) => `${C.cyan}${s}${C.reset}`;

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(pass(label));
    passed += 1;
  } else {
    console.log(fail(label));
    failed += 1;
  }
}

function approx(actual, expected, tolerance = 0.01) {
  return Math.abs(actual - expected) <= tolerance;
}

const PUBLIC_RESULTS = {
  experiment1: {
    tokensPerPromotion: 6100,
    tokensSavedPerReuse: 2036,
    expectedBreakEven: 3.0,
  },
  experiment4: {
    validMatches: 3,
    invalidMatches: 1,
    tokensSaved: 6108,
  },
  experiment6: {
    totalDecisions: 200,
    validMatches: 23,
    preferCount: 82,
    fallbackCount: 95,
    decayEvents: 11,
    finalTopGeneShare: 0.146,
    tokensSaved: 46828,
  },
};

console.log(head('RLP Public Results Verifier'));
console.log(
  info(
    'This verifier checks published metrics only. Production retrieval and runtime logic are intentionally not included.'
  )
);

console.log(head('Experiment 1  Break-even Consistency'));
const breakEven =
  PUBLIC_RESULTS.experiment1.tokensPerPromotion /
  PUBLIC_RESULTS.experiment1.tokensSavedPerReuse;
assert(
  approx(breakEven, PUBLIC_RESULTS.experiment1.expectedBreakEven, 0.01),
  `Break-even reuses ~= ${PUBLIC_RESULTS.experiment1.expectedBreakEven} (got ${breakEven.toFixed(2)})`
);

console.log(head('Experiment 4  Gap 10 Consistency'));
assert(
  PUBLIC_RESULTS.experiment4.validMatches *
    PUBLIC_RESULTS.experiment1.tokensSavedPerReuse ===
    PUBLIC_RESULTS.experiment4.tokensSaved,
  `Experiment 4 token savings match 3 x 2,036 = ${PUBLIC_RESULTS.experiment4.tokensSaved.toLocaleString()}`
);
assert(
  PUBLIC_RESULTS.experiment4.invalidMatches === 1,
  'Experiment 4 records one invalid-action event'
);

console.log(head('Experiment 6  Live Retrieval Consistency'));
const exp6 = PUBLIC_RESULTS.experiment6;
assert(
  exp6.validMatches + exp6.preferCount + exp6.fallbackCount === exp6.totalDecisions,
  `Decision buckets sum to ${exp6.totalDecisions}`
);
assert(
  exp6.validMatches * PUBLIC_RESULTS.experiment1.tokensSavedPerReuse ===
    exp6.tokensSaved,
  `Experiment 6 token savings match 23 x 2,036 = ${exp6.tokensSaved.toLocaleString()}`
);
assert(exp6.decayEvents === 11, 'Experiment 6 records 11 decay events');
assert(
  exp6.finalTopGeneShare < 0.2,
  `Final top-gene share remains bounded (${(exp6.finalTopGeneShare * 100).toFixed(1)}%)`
);
assert(
  exp6.validMatches >= Math.ceil(breakEven),
  `Experiment 6 crosses break-even with ${exp6.validMatches} valid reuses`
);

console.log(head('Summary'));
console.log(info(`Passed: ${passed}`));
console.log(info(`Failed: ${failed}`));

if (failed > 0) {
  process.exit(1);
}

console.log(pass('All public paper checks passed'));
