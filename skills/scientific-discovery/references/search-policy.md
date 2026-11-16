# Candidate lineage and search policy

Use when a sustained experiment campaign needs explicit branch selection, budget allocation or
workflow improvement. A compact table in the existing ledger can be sufficient; a new search engine
is not required. Keep the scientific map separate from the number of code-tree nodes.

## Candidate records

Record candidate ID, parent(s), method family, operation, source hash, experimental card/control,
status, metric/uncertainty, resource cost and artifact pointer. Distinguish:

- **Draft:** a new mechanism/system from the actual task, potentially a new root.
- **Debug:** repair execution or correctness while preserving the intended mechanism.
- **Improve:** a controlled modification of a valid candidate.
- **Combine:** a measured interaction between candidates, with both parents and matched controls.

A failed import is a debug outcome, not a scientific refutation. Put a task-specific bound on repeated
repair before choosing a simpler proof or another branch. Preserve failed artifacts for inspection.

## Choose where to spend the next wave

Consider plausible headroom, independent information, uncertainty, prerequisites, time to a decisive
test and remaining budget. Develop promising existing candidates, but retain an opportunity for new
roots when coverage is weak. Rank scientific validity before a noisy score. Do not choose only the
latest candidate, repeatedly revisit old ideas without new evidence, or reward submission count.

An atomic change helps causal interpretation within a branch. A coordinated architectural replacement
may need several parts changed together; test it as a coherent alternative, with ablations where useful.
The scientific search should not be restricted to whatever one existing parameter schema can express.

Provide workers the chosen candidate and decision-relevant evidence, not every historical log. Fresh
problem-first proposals can challenge the roots themselves. Compare proposed novelty against actual
functional changes before allocating substantial compute.

## Improve the research procedure itself

Treat changes to selection policy, prompts, memory and coordination as hypotheses too. Test changed
procedures against the previous version with comparable budgets where practical. Keep some behavioral
cases or project/domain examples outside the edit-and-select loop; report when no such holdout exists.
Avoid changing a verifier to reward the new procedure, optimizing only a public case set, or selecting
a workflow because its explanations sound more confident. Use the evolution protocol for skill edits.

## Source basis and limits

[AIDE, 18 February 2025](https://arxiv.org/html/2502.13138) represents candidates as a code-solution
tree, with drafting, debugging, improvement, evaluation and selective history summaries. Its example
policy improves the best valid candidate after initial drafts. Our ongoing coverage checks and new-root
allocation are additional choices; tree structure alone does not ensure broad scientific exploration.

[AIDE², 22 September 2026](https://arxiv.org/abs/2609.26457) evaluates changes to the research agent
itself and retains improvements using separate evaluations. Its abstract reports held-out transfer.
Only the abstract was checked here; this skill does not claim to reproduce its full system or results.
Neither paper requires using a commercial Weco service, and reading them authorizes no paid run.
