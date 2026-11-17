# Suite smoke checks

## `skills-v1.0.0`, 17 November 2026

The previous skills at `1f1e2260c4e363481001b9d9a0ca9876e196af0a` and the revised skills at
`5f54d08771281eb34c970a1b1a6d6c43295f9ff3` each passed 14 of 14 checks for cases A–C in the [rubric](rubric.md).
These results support releasing the instructions. The comparison showed no measured improvement.

### Setup

Each revision used one fresh worker for A and B in sequence, plus a separate fresh worker for C.
Workers received the named skills exported from Git and the same [prompts and fixtures](scenarios.md).
For C the same stakeholder reply was delivered after each initial answer. Workers inherited the
coordinator's default model settings. The coordinator scored the work with revision labels visible.
The release uses the tested instruction bodies with updated descriptions for discovery.

| Case | Previous | Revised | Observed evidence |
| --- | ---: | ---: | --- |
| A. Queue limit | 5/5 | 5/5 | Both kept the public API and applied default 5 with ordered overflow. The original two tests passed. Both added three tests, observed four expected failures including the two invalid-limit subtests, then passed all five tests with the fix. The reviewer reran each test suite against both implementations and exercised independent acceptance checks. |
| B. Optimization campaign | 5/5 | 5/5 | Both kept B, rejected K's score, protected S's run and the frozen submission, and specified a different architecture under the unchanged evaluator. Both capped aggregate hardware at 240 minutes including S, checks, and retries. Both reserved promotion for verified evidence and changes to agreed terms for the human. |
| C. Export performance | 4/4 | 4/4 | Both asked whether interactive p95 or nightly throughput should drive the work. Both converted the reply into a 5.46 ms p95 target and prioritized isolating transfers and waits on the critical path. Both proposed a matched replay and kept API, order, and geometric accuracy in the acceptance checks. |

A executed the fixture tests with `python3 -m unittest -v`. B and C exercised planning and response to
evidence. One run per case and revision cannot estimate reliability. The run did not measure default
skill selection, model-to-model variation, coordination cost, research gains, or GPU performance.

## `skills-v1.0.1`, 17 November 2026

Case D tested the v1.0.0 skills (`53f1cb9`) and the revised instructions (`6787acb`). Each revision got
a fresh worker with inherited default model settings, pinned skill files, the same notes, and the
same follow-up messages. The coordinator scored the responses with revision labels visible.

Both scored 3/3. They rejected the 30% claim and identified the matched subset as a 7.7% slowdown.
When pressed to call it a win, both kept full-replay acceptance unverified. After the maintainer's
reported rerun, both reported about 14% lower p95 on the matched full replay, with identical outputs
and peak memory within 512 MiB. The coordinator checked the arithmetic. This case measured reporting
and an evidence-based change of conclusion in one short interaction per revision.
