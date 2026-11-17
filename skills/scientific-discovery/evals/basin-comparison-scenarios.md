# Exploration and delegation comparison scenarios

These synthetic fixtures test planning decisions, not scientific results. Give each worker the same
skill snapshot, task instructions and fixtures. Do not give workers the scoring rubric or another
worker's response. Each worker must state assumptions and may use the skill's local references.

## A: Segment cells across hospitals

User: “We have eight GPU-hours left. Plan the next wave to improve performance on new hospitals.”

- Metric: mean cell-segmentation F1 on held-out hospitals. Images and annotations are already available.
- Four hospitals provide development data; a fifth remains untouched for final evaluation.
- Current code uses a U-Net on RGB tiles, with supervised pixel labels and a fixed threshold.
- Fifty runs adjusted augmentations, learning rates or seeds. A self-supervised approach failed to
  load before training. A sixth group was created by resampling tiles from the existing hospitals.
- The evaluation contract requires hospital-disjoint selection and a final untouched hospital test.
  The deadline and compute budget rule out collecting new annotations.
- The last user report claims “we tried all representations.” No other implementation is documented.

Return a compact audit and a budgeted research wave. State data access limits and credible controls.

## B: Forecast electric load with limited runtime

User: “Performance plateaued; investigate approaches that can change the result, and plan four
compute-hours. We must keep the production forecast deadline.”

- Outcome: day-ahead 90th-percentile hourly load for 300 sites; score is mean pinball loss.
- The service must finish all sites within five minutes on one CPU server. Past loads and calendar
  features are known; actual future temperature is not available at inference, but forecasts are.
- Three years of historical hourly data are available; an untouched final month is reserved.
- The incumbent uses a separately fitted tree per site and a fixed trailing 24-hour feature window.
- The past 80 runs changed tree depth, seeds or learning rate. A shared model once failed because
  site identifiers were missing from a data loader. No valid shared model has been tested.

Return a research wave with matched evaluation, runtime checks, and a condition for preferring the
incumbent. Explain which claims remain hypothetical.

## C: Coordinate a materials-search campaign

User: “Coordinate the next research wave with two available assistants. We have four simulator-hours.
Keep the running job and the best validated result safe. Return the exact briefs and review plan.”

- The simulator evaluates a candidate composition and returns measured strength and feasibility.
  The actual contract permits any feasible composition in the same element set.
- The incumbent searches a two-component mixture. Thirty runs only tune its optimizer and seeds.
- A running job uses a pinned source snapshot. The scientific ledger contains results and failures;
  a past three-component run was canceled before its first evaluation.
- Assistant 1 can only propose designs; assistant 2 can run authorized tests in an isolated directory.
  Neither may modify the ledger or the running job. No paid services or external data sharing are allowed.
- The current claim that three-component mixtures are “closed” rests on the canceled run alone.

Provide the complete task brief to each assistant, the division of the four simulator-hours, and the
coordinator's checks before accepting results. Distinguish a fresh context from one that merely has a
new role; identify what evidence a proposer sees before and after proposing.
