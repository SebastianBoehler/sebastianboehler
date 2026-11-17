---
name: citation-verification
description: Use when checking scientific manuscript claims against papers, auditing citations, or building a source-grounded literature corpus for research writing.
---

# Verify scientific claims and citations

Confirm both the identity of each source and what the cited source actually supports. A working DOI,
retrieved passage, plausible bibliography entry, or model-generated summary is not claim verification.

## Prepare the corpus

1. Identify the manuscript or claims, intended citation style, accessible sources and permitted tools.
   Use the project's existing bibliography and storage. Record stable identifiers, source version,
   publication status and links; check metadata against a primary registry or publisher when available.
2. Choose the lightest method that makes relevant passages findable: source text and manual search for
   a small corpus, an existing document search tool for a larger corpus, or a retrieval index when its
   benefits justify setup and maintenance. Do not require embeddings, an external provider, or a service.
3. Respect source access and sharing permissions. A missing full text or failed extraction is a stated
   limit, not a reason to invent a passage. A bibliography is not automatically complete.

## Verify each material claim

For every claim–citation pair, inspect the source passage, table, figure or result in its context.
Record a locator (page, section, figure, table, or stable link), source version, and a concise rationale.
Compare population, setting, methods, metric, uncertainty, causal language and scope as relevant.
Distinguish the authors' result, their interpretation, and the manuscript author's inference.

Use these statuses:

- **Supported:** the inspected source supports the claim at the stated scope.
- **Partially supported:** only a narrower or qualified claim is supported; propose the correction.
- **Contradicted:** the inspected source conflicts with the claim; show the relevant evidence.
- **Unverified:** the source or needed passage is unavailable, ambiguous, or not inspected.

An abstract can support a claim explicitly stated there, but label the evidence as abstract-only and
do not claim full-text verification. Search for relevant limitations or conflicting evidence when the
claim requires it. Flag outdated versions, retractions and metadata discrepancies when found; check
current status against an authoritative source when it matters.

## Return the audit

Use a compact claim–source–locator–status–reason record in the existing project format. Correct claims
or bibliography entries only within the authorized task. Summarize unresolved pairs and access limits.
For a large document, report coverage; a spot check is not verification of the complete manuscript.
Use the existing citation-management workflow for metadata and bibliography formatting where available.
