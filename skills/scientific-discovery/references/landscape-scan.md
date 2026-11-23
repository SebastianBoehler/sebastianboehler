# Scan the research landscape

Use before choosing a direction in an unfamiliar field, when a literature search keeps returning the
same cluster, or when a plateau suggests the method family came from too narrow a reading. The scan
maps where ideas could come from; it does not establish that any of them transfer here.

## Frame the question at two levels

Write a short problem statement that says what is known, what is unresolved, and the open question,
without naming the solution you expect. Add a few narrower sub-questions for the components or
bottlenecks. Search with each level separately; broad and narrow questions surface different sources.

## Search beyond topical neighbours

Papers that inspire a direction are often not the most similar ones. Combine:

- **Keyword and dense search** for the core and sub-questions.
- **Citation trail:** the references of the strongest recent papers and the papers that cite them.
- **Mechanism search:** describe the needed mechanism or bottleneck without field vocabulary, then
  search adjacent fields that face the same structure.
- **Primary sources** for any method you might adopt: paper, official code, dates, and assumptions.

Generating a hypothetical abstract and searching with it can narrow results toward the expected
answer; prefer the actual question and citation expansion. Treat agent search as incomplete: report
what was searched, the cut-off date, and which areas were not covered.

## Return a map, not a reading list

Group sources by mechanism and the assumption each changes, not by venue or keyword. For each group,
record the strongest evidence, its scope, and the cheapest test that would show whether it transfers
here. Mark groups found only through citation or cross-field search; these are candidates for a
different idea basin. Feed the groups into the alternatives ledger and the
[coverage audit](coverage-audit.md); a source in the map is a proposal, not a tested family.

## Source

[Kim et al., *ScholarCatalyst*, 1 Oct. 2026](https://arxiv.org/abs/2610.02202v1) asked 184 authors
of 207 CS/AI papers to label which earlier papers inspired their projects. Labeled inspirations were
on average no more lexically similar to the research question than hard negatives (§4.3, Table 11).
43.6% of sub-question inspirations were uncited, and 67.8% of those shared no references with the
source paper (§4.3). The best dense retrievers reached about 0.37–0.38 Recall@20 on core questions.
Adding the source bibliography raised core-question Recall@20 from 0.39 to 0.74 (Table 4), and
hypothetical-abstract rewriting lowered it to 0.18–0.23 (Table 5). The benchmark covers CS papers
from 2025–2026 with retrospective author labels. It evaluates retrieval of inspirations, not whether
a landscape scan improves research outcomes.
